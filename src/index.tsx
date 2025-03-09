import { mailRoutes } from "./routes/mail.routes";
import { serve } from "bun";
import * as process from "process";

const server = serve({
	port: 3000,
	routes: {
		...mailRoutes,
	}
});

// For running in docker
process.on('SIGTERM', async () => {
	console.info("Interrupted")
	await server.stop(true);
	process.exit(0)
});