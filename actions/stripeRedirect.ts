"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

export async function stripeRedirect() {
	const user = await currentUser();
	const { orgId, userId } = await auth();
	if (!orgId || !userId) {
		throw new Error("Unauthorized");
	}

	const settingsUrl = absoluteUrl(`/organization/${orgId}`);
	let url = "";

	try {
		const orgSubscription = await db.orgSubscription.findUnique({
			where: {
				orgId,
			},
		});

		if (orgSubscription && orgSubscription.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: orgSubscription.stripeCustomerId,
				return_url: settingsUrl,
			});

			url = stripeSession.url;
		} else {
			const stripeSession = await stripe.checkout.sessions.create({
				success_url: settingsUrl,
				cancel_url: settingsUrl,
				payment_method_types: ["card"],
				mode: "subscription",
				billing_address_collection: "auto",
				customer_email: user?.emailAddresses[0].emailAddress,
				line_items: [
					{
						price_data: {
							currency: "USD",
							product_data: {
								name: "TaskFlow Pro",
								description:
									"Unlimited Boards for you organization",
							},
							unit_amount: 2000,
							recurring: {
								interval: "month",
							},
						},
						quantity: 1,
					},
				],
				metadata: {
					orgId,
				},
			});
			url = stripeSession.url || "";
		}
	} catch (error) {
		throw new Error("Something went wrong");
	}

	revalidatePath(`/organization/${orgId}`);
	return { data: url };
}
