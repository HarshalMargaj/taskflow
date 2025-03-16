// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
// 	"/",
// 	"/sign-in(.*)",
// 	"/sign-up(.*)",
// 	"/api/webhook",
// ]);

// export default clerkMiddleware(async (auth, request) => {
// 	if (!isPublicRoute(request)) {
// 		await auth.protect();
// 	}
// });

// export const config = {
// 	matcher: [
// 		// Skip Next.js internals and all static files, unless found in search params
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		// Always run for API routes
// 		"/(api|trpc)(.*)",
// 	],
// };
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/api/webhook",
]);

export default clerkMiddleware(async (auth, request) => {
	const { userId } = await auth();

	// If not a public route and user is not logged in, redirect to sign-in
	if (!isPublicRoute(request)) {
		await auth.protect();
	}

	// Redirect signed-in users to /select-org if they're visiting the home page
	if (userId && new URL(request.url).pathname === "/") {
		return Response.redirect(new URL("/select-org", request.url));
	}
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
