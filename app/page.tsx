"use client";

import { useState, useEffect } from "react";
import {
	FaHeart,
	FaStar,
	FaVenus,
	FaMars,
	FaGenderless,
	FaShare,
	FaCopy,
	FaDownload,
	FaPrint,
	FaFacebook,
	FaTwitter,
	FaWhatsapp,
	FaGithub,
} from "react-icons/fa";

import { CompatibilityBreakdown } from "./types";
import { ZODIAC_SIGNS } from "./constants";
import {
	getZodiac,
	calculateNameCompatibility,
	calculateAgeCompatibility,
	calculateZodiacCompatibility,
	calculateElementCompatibility,
	getConsistentRandom,
	getCompatibilityMessage,
	getLoveTips,
} from "./utils";
import {
	generateShareableLink,
	shareResults as shareResultsUtil,
	copyToClipboard as copyToClipboardUtil,
	shareOnSocial as shareOnSocialUtil,
	printResults as printResultsUtil,
	downloadResults as downloadResultsUtil,
} from "./shareUtils";

export default function Home() {
	const [name1, setName1] = useState<string>("");
	const [gender1, setGender1] = useState<string>("");
	const [dob1, setDob1] = useState<string>("");
	const [name2, setName2] = useState<string>("");
	const [gender2, setGender2] = useState<string>("");
	const [dob2, setDob2] = useState<string>("");
	const [result, setResult] = useState<number | null>(null);
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [zodiac1, setZodiac1] = useState<string>("");
	const [zodiac2, setZodiac2] = useState<string>("");
	const [breakdown, setBreakdown] = useState<CompatibilityBreakdown | null>(
		null
	);
	const [showDetails, setShowDetails] = useState<boolean>(false);
	const [showConfetti, setShowConfetti] = useState<boolean>(false);
	const [shareableLink, setShareableLink] = useState<string>("");
	const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const n1 = urlParams.get("n1");
		const g1 = urlParams.get("g1");
		const d1 = urlParams.get("d1");
		const n2 = urlParams.get("n2");
		const g2 = urlParams.get("g2");
		const d2 = urlParams.get("d2");
		const r = urlParams.get("r");

		if (n1 && g1 && d1 && n2 && g2 && d2 && r) {
			setName1(decodeURIComponent(n1));
			setGender1(g1);
			setDob1(d1);
			setName2(decodeURIComponent(n2));
			setGender2(g2);
			setDob2(d2);

			setTimeout(() => {
				const zodiacSign1 = getZodiac(d1);
				const zodiacSign2 = getZodiac(d2);

				setZodiac1(zodiacSign1?.name || "");
				setZodiac2(zodiacSign2?.name || "");

				const resultNum = parseInt(r);
				setResult(resultNum);

				let compatibilityMessage = getCompatibilityMessage(resultNum, g1, g2);
				setMessage(compatibilityMessage);

				const link = generateShareableLink(
					decodeURIComponent(n1),
					decodeURIComponent(n2),
					g1,
					g2,
					d1,
					d2,
					resultNum
				);
				setShareableLink(link);
			}, 500);
		}
	}, []);

	const calculateCompatibility = (): void => {
		if (!name1 || !name2 || !gender1 || !gender2 || !dob1 || !dob2) {
			alert("Please fill in all fields!");
			return;
		}

		if (new Date(dob1) > new Date() || new Date(dob2) > new Date()) {
			alert("Please enter valid birthdate!");
			return;
		}

		setLoading(true);

		setTimeout(() => {
			const nameComp = calculateNameCompatibility(name1, name2);
			const ageComp = calculateAgeCompatibility(dob1, dob2);

			const zodiacSign1 = getZodiac(dob1);
			const zodiacSign2 = getZodiac(dob2);

			const zodiacComp =
				zodiacSign1 && zodiacSign2
					? calculateZodiacCompatibility(zodiacSign1, zodiacSign2)
					: 50;

			const elementComp =
				zodiacSign1 && zodiacSign2
					? calculateElementCompatibility(zodiacSign1, zodiacSign2)
					: 50;

			const randomFactor = getConsistentRandom(name1, name2, dob1, dob2);

			const total = Math.round(
				nameComp * 0.25 +
					ageComp * 0.2 +
					zodiacComp * 0.25 +
					elementComp * 0.2 +
					randomFactor * 0.1
			);

			const finalResult = Math.max(0, Math.min(100, total));

			setZodiac1(zodiacSign1?.name || "");
			setZodiac2(zodiacSign2?.name || "");
			setBreakdown({
				name: nameComp,
				age: ageComp,
				zodiac: zodiacComp,
				element: elementComp,
				random: randomFactor,
				total: finalResult,
			});
			setResult(finalResult);
			setMessage(getCompatibilityMessage(finalResult, gender1, gender2));
			setLoading(false);

			if (finalResult >= 70) {
				setShowConfetti(true);
				setTimeout(() => setShowConfetti(false), 3000);
			}

			const link = generateShareableLink(
				name1,
				name2,
				gender1,
				gender2,
				dob1,
				dob2,
				finalResult
			);
			setShareableLink(link);
		}, 1500);
	};

	const resetCalculator = () => {
		setName1("");
		setGender1("");
		setDob1("");
		setName2("");
		setGender2("");
		setDob2("");
		setResult(null);
		setMessage("");
		setZodiac1("");
		setZodiac2("");
		setBreakdown(null);
		setShowDetails(false);
		setShowConfetti(false);
		setShareableLink("");
		setCopiedToClipboard(false);
		window.history.replaceState({}, "", window.location.pathname);
	};

	const getGenderIcon = (gender: string) => {
		switch (gender) {
			case "male":
				return <FaMars className="text-blue-400" />;
			case "female":
				return <FaVenus className="text-pink-400" />;
			default:
				return <FaGenderless className="text-purple-400" />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(20)].map((_, i) => (
					<FaHeart
						key={i}
						className="absolute text-white opacity-20 animate-bounce"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 2}s`,
							fontSize: `${Math.random() * 20 + 10}px`,
						}}
					/>
				))}
			</div>

			{showConfetti && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{[...Array(100)].map((_, i) => (
						<div
							key={i}
							className="absolute animate-confetti"
							style={{
								left: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 2}s`,
								fontSize: `${Math.random() * 20 + 10}px`,
							}}
						>
							{
								["🎉", "💖", "✨", "💕", "🌟", "💫", "🎊", "💝"][
									Math.floor(Math.random() * 8)
								]
							}
						</div>
					))}
				</div>
			)}

			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
				<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 text-center animate-pulse drop-shadow-lg">
					Love Calculator{" "}
					<FaHeart className="inline text-red-400 animate-ping" />
				</h1>

				<div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full border border-white/20">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
						<div className="bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10">
							<h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center">
								<FaStar className="mr-2 text-yellow-400" /> Your Info
							</h2>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="Your Name"
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={name1}
									onChange={(e) => setName1(e.target.value)}
								/>
								<select
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={gender1}
									onChange={(e) => setGender1(e.target.value)}
								>
									<option value="" className="text-gray-800">
										Select Gender
									</option>
									<option value="male" className="text-gray-800">
										Male
									</option>
									<option value="female" className="text-gray-800">
										Female
									</option>
									<option value="non-binary" className="text-gray-800">
										Non-Binary
									</option>
								</select>
								<input
									type="date"
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={dob1}
									onChange={(e) => setDob1(e.target.value)}
								/>
							</div>
						</div>

						<div className="bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10">
							<h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center">
								<FaStar className="mr-2 text-yellow-400" /> Partner&apos;s Info
							</h2>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="Partner's Name"
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={name2}
									onChange={(e) => setName2(e.target.value)}
								/>
								<select
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={gender2}
									onChange={(e) => setGender2(e.target.value)}
								>
									<option value="" className="text-gray-800">
										Select Gender
									</option>
									<option value="male" className="text-gray-800">
										Male
									</option>
									<option value="female" className="text-gray-800">
										Female
									</option>
									<option value="non-binary" className="text-gray-800">
										Non-Binary
									</option>
								</select>
								<input
									type="date"
									className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
									value={dob2}
									onChange={(e) => setDob2(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
						<button
							className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold hover:from-rose-500 hover:to-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
							onClick={calculateCompatibility}
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
									Calculating...
								</div>
							) : (
								"Calculate Love Compatibility 💖"
							)}
						</button>
						<button
							className="bg-white/20 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-sm sm:text-base"
							onClick={resetCalculator}
						>
							Reset 🔄
						</button>
					</div>

					{result !== null && (
						<div className="bg-white/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/20 animate-fade-in">
							<div className="text-center mb-4 sm:mb-6">
								<h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 animate-bounce">
									{result}% Compatibility!
								</h3>
								<p className="text-lg sm:text-xl text-white/90">{message}</p>
							</div>

							{zodiac1 && zodiac2 && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
									<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
										<h4 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
											{getGenderIcon(gender1)} {name1}&apos;s Zodiac: {zodiac1}
										</h4>
										<p className="text-white/80 text-xs sm:text-sm">
											{
												ZODIAC_SIGNS.find((z) => z.name === zodiac1)
													?.description
											}
										</p>
									</div>
									<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
										<h4 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
											{getGenderIcon(gender2)} {name2}&apos;s Zodiac: {zodiac2}
										</h4>
										<p className="text-white/80 text-xs sm:text-sm">
											{
												ZODIAC_SIGNS.find((z) => z.name === zodiac2)
													?.description
											}
										</p>
									</div>
								</div>
							)}

							{breakdown && (
								<div className="mb-6">
									<button
										className="w-full bg-white/20 text-white p-2 sm:p-3 rounded-lg font-semibold hover:bg-white/30 transition-all mb-3 sm:mb-4 text-sm sm:text-base"
										onClick={() => setShowDetails(!showDetails)}
									>
										{showDetails ? "Hide" : "Show"} Detailed Breakdown 📊
									</button>
									{showDetails && (
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
											<div className="text-center">
												<div className="text-lg sm:text-2xl font-bold text-white">
													{breakdown.name}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Names
												</div>
											</div>
											<div className="text-center">
												<div className="text-lg sm:text-2xl font-bold text-white">
													{breakdown.age}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Age
												</div>
											</div>
											<div className="text-center">
												<div className="text-lg sm:text-2xl font-bold text-white">
													{breakdown.zodiac}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Zodiac
												</div>
											</div>
											<div className="text-center">
												<div className="text-lg sm:text-2xl font-bold text-white">
													{breakdown.element}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Element
												</div>
											</div>
											<div className="text-center col-span-2 sm:col-span-1">
												<div className="text-lg sm:text-2xl font-bold text-white">
													{breakdown.random}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Magic
												</div>
											</div>
										</div>
									)}
								</div>
							)}

							<div className="bg-white/5 p-3 sm:p-4 rounded-lg mb-4">
								<h4 className="text-base sm:text-lg font-semibold text-white mb-2">
									💡 Love Tips
								</h4>
								<ul className="text-white/80 text-xs sm:text-sm space-y-1">
									{getLoveTips(result).map((tip, index) => (
										<li key={index}>• {tip}</li>
									))}
								</ul>
							</div>

							<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
								<h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center">
									<FaShare className="mr-2" /> Share Your Results
								</h4>

								<div className="flex flex-wrap gap-2 mb-3">
									<button
										onClick={() =>
											shareOnSocialUtil(
												"facebook",
												name1,
												name2,
												result,
												shareableLink
											)
										}
										className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaFacebook className="mr-1" /> Facebook
									</button>
									<button
										onClick={() =>
											shareOnSocialUtil(
												"twitter",
												name1,
												name2,
												result,
												shareableLink
											)
										}
										className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaTwitter className="mr-1" /> Twitter
									</button>
									<button
										onClick={() =>
											shareOnSocialUtil(
												"whatsapp",
												name1,
												name2,
												result,
												shareableLink
											)
										}
										className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaWhatsapp className="mr-1" /> WhatsApp
									</button>
								</div>

								<div className="flex flex-wrap gap-2">
									<button
										onClick={() =>
											shareResultsUtil(name1, name2, result, shareableLink)
										}
										className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaShare className="mr-1" /> Share
									</button>
									<button
										onClick={() =>
											copyToClipboardUtil(
												name1,
												name2,
												result,
												shareableLink,
												setCopiedToClipboard
											)
										}
										className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaCopy className="mr-1" />{" "}
										{copiedToClipboard ? "Copied!" : "Copy"}
									</button>
									<button
										onClick={() =>
											downloadResultsUtil(
												name1,
												name2,
												result,
												zodiac1,
												zodiac2
											)
										}
										className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaDownload className="mr-1" /> Download
									</button>
									<button
										onClick={() =>
											printResultsUtil(
												name1,
												name2,
												result,
												message,
												zodiac1,
												zodiac2,
												breakdown
											)
										}
										className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
									>
										<FaPrint className="mr-1" /> Print
									</button>
								</div>

								{shareableLink && (
									<div className="mt-3 p-2 bg-white/10 rounded-lg">
										<p className="text-xs text-white/70 mb-1">
											Shareable Link:
										</p>
										<input
											type="text"
											value={shareableLink}
											readOnly
											className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-xs text-white"
											onClick={(e) => e.currentTarget.select()}
										/>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="mt-6 text-center text-white/80 text-sm">
					<div className="flex items-center justify-center gap-4 mb-2">
						<a
							href="https://github.com/AIPTU/love-calculator"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 hover:text-white transition-colors"
						>
							<FaGithub className="text-xl" />
							<span>View on GitHub</span>
						</a>
					</div>
					<p className="text-xs">
						© {new Date().getFullYear()} Love Calculator. All rights reserved.
					</p>
					<p className="text-xs mt-1 text-white/60">
						For entertainment purposes only. Not a substitute for professional
						relationship advice.
					</p>
				</div>
			</div>
		</div>
	);
}
