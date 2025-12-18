/**
 * Turso Migration Script
 *
 * Applies pending Prisma migrations to Turso database.
 * Usage: bun run db:migrate:turso [migration_name]
 *
 * If migration_name is provided, only that migration will be applied.
 * Otherwise, all pending migrations will be applied.
 */

import "dotenv/config";

import { createClient } from "@libsql/client";
import { existsSync } from "fs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { basename, join } from "path";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const MIGRATIONS_PATH = join(process.cwd(), "prisma/migrations");
const APPLIED_MIGRATIONS_FILE = join(process.cwd(), ".turso-migrations.json");

interface AppliedMigrations {
	applied: string[];
	lastApplied: string | null;
}

async function getAppliedMigrations(): Promise<AppliedMigrations> {
	if (!existsSync(APPLIED_MIGRATIONS_FILE)) {
		return { applied: [], lastApplied: null };
	}
	const content = await readFile(APPLIED_MIGRATIONS_FILE, "utf-8");
	return JSON.parse(content);
}

async function saveAppliedMigrations(
	migrations: AppliedMigrations,
): Promise<void> {
	await writeFile(APPLIED_MIGRATIONS_FILE, JSON.stringify(migrations, null, 2));
}

async function getMigrationDirectories(): Promise<string[]> {
	const entries = await readdir(MIGRATIONS_PATH, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => entry.name)
		.sort();
}

async function getMigrationSQL(migrationName: string): Promise<string | null> {
	const sqlPath = join(MIGRATIONS_PATH, migrationName, "migration.sql");
	if (!existsSync(sqlPath)) {
		return null;
	}
	return readFile(sqlPath, "utf-8");
}

function splitSQLStatements(sql: string): string[] {
	// Remove comments and split by semicolons
	const cleanedSQL = sql
		.split("\n")
		.filter((line) => !line.trim().startsWith("--"))
		.join("\n");

	return cleanedSQL
		.split(";")
		.map((stmt) => stmt.trim())
		.filter((stmt) => stmt.length > 0);
}

async function main() {
	if (!TURSO_DATABASE_URL) {
		console.error("❌ TURSO_DATABASE_URL is required");
		process.exit(1);
	}

	console.log("📦 Connecting to Turso...");
	const client = createClient({
		url: TURSO_DATABASE_URL,
		authToken: TURSO_AUTH_TOKEN,
	});

	const specificMigration = process.argv[2];
	const appliedMigrations = await getAppliedMigrations();
	const allMigrations = await getMigrationDirectories();

	console.log(`📋 Found ${allMigrations.length} migrations`);
	console.log(
		`✅ ${appliedMigrations.applied.length} already applied to Turso`,
	);

	// Filter pending migrations
	let pendingMigrations: string[];

	if (specificMigration) {
		if (!allMigrations.includes(specificMigration)) {
			console.error(`❌ Migration "${specificMigration}" not found`);
			process.exit(1);
		}
		pendingMigrations = [specificMigration];
		console.log(`🎯 Applying specific migration: ${specificMigration}`);
	} else {
		pendingMigrations = allMigrations.filter(
			(m) => !appliedMigrations.applied.includes(m),
		);
		console.log(`⏳ ${pendingMigrations.length} migrations pending`);
	}

	if (pendingMigrations.length === 0) {
		console.log("✅ All migrations already applied!");
		await client.close();
		return;
	}

	console.log("");

	for (const migration of pendingMigrations) {
		console.log(`🚀 Applying migration: ${migration}`);

		const sql = await getMigrationSQL(migration);
		if (!sql) {
			console.log(`   ⚠️  No migration.sql found, skipping`);
			continue;
		}

		const statements = splitSQLStatements(sql);
		console.log(`   📝 ${statements.length} statements to execute`);

		try {
			for (let i = 0; i < statements.length; i++) {
				const stmt = statements[i];
				console.log(`   [${i + 1}/${statements.length}] Executing...`);

				try {
					await client.execute(stmt);
				} catch (stmtError: unknown) {
					const errorMessage =
						stmtError instanceof Error ? stmtError.message : String(stmtError);
					// Handle "table already exists" or "index already exists" gracefully
					if (
						errorMessage.includes("already exists") ||
						(errorMessage.includes("SQLITE_ERROR") &&
							stmt.includes("CREATE TABLE IF NOT EXISTS"))
					) {
						console.log(
							`   ⚠️  Skipping (already exists): ${stmt.substring(0, 50)}...`,
						);
						continue;
					}
					throw stmtError;
				}
			}

			// Mark migration as applied
			if (!appliedMigrations.applied.includes(migration)) {
				appliedMigrations.applied.push(migration);
				appliedMigrations.lastApplied = migration;
				await saveAppliedMigrations(appliedMigrations);
			}

			console.log(`   ✅ Success`);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(`   ❌ Error: ${errorMessage}`);

			// Ask if user wants to mark as applied anyway (for cases where migration was partially applied)
			console.log(`   💡 If this migration was already applied manually, run:`);
			console.log(
				`      echo '{"applied":${JSON.stringify([...appliedMigrations.applied, migration])},"lastApplied":"${migration}"}' > .turso-migrations.json`,
			);

			await client.close();
			process.exit(1);
		}
	}

	console.log("");
	console.log("✨ All migrations applied successfully!");

	await client.close();
}

main().catch((e) => {
	console.error("❌ Unhandled error:", e);
	process.exit(1);
});
