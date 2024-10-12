import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Love Calculator",
	description: "A simple love calculator built with Next.js",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-background text-foreground">{children}</body>
		</html>
	);
}
