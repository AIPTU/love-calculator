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
} from "react-icons/fa";

// Get the base path dynamically
const getBasePath = () => {
	if (typeof window !== "undefined") {
		const pathname = window.location.pathname;
		const match = pathname.match(/^\/([^\/]+)/);
		if (match && match[1] && !pathname.startsWith("/?")) {
			return `/${match[1]}`;
		}
	}
	return "";
};

interface ZodiacSign {
	name: string;
	start: string;
	end: string;
	compatibleWith: string[];
	description: string;
	element: string;
}

interface CompatibilityBreakdown {
	name: number;
	age: number;
	zodiac: number;
	gender: number;
	random: number;
	total: number;
}

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
		// Load data from URL parameters if present
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

			// Simulate calculation with the shared result
			setTimeout(() => {
				const zodiacSign1 = getZodiac(d1);
				const zodiacSign2 = getZodiac(d2);

				setZodiac1(zodiacSign1?.name || "");
				setZodiac2(zodiacSign2?.name || "");

				const resultNum = parseInt(r);
				setResult(resultNum);

				let compatibilityMessage = "";
				if (resultNum >= 90) {
					compatibilityMessage =
						"Perfect match! Your love story is written in the stars! ✨";
				} else if (resultNum >= 70) {
					compatibilityMessage =
						"Great compatibility! With effort, this could be amazing! 💕";
				} else if (resultNum >= 50) {
					compatibilityMessage =
						"Decent match. Love requires work, but it's possible! 🤝";
				} else {
					compatibilityMessage =
						"Challenging compatibility. Friendship might be a better path! 🌟";
				}

				if (g1 === g2) {
					compatibilityMessage += " 🌈 Love knows no boundaries! 🏳️‍🌈";
				}

				setMessage(compatibilityMessage);
				generateShareableLink();
			}, 500);
		}
	}, []);

	const zodiacSigns: ZodiacSign[] = [
		{
			name: "Capricorn",
			start: "12-22",
			end: "01-19",
			compatibleWith: ["Taurus", "Virgo", "Scorpio", "Pisces"],
			description:
				"Ambitious, disciplined, and reliable. Capricorns value tradition and hard work.",
			element: "Earth",
		},
		{
			name: "Aquarius",
			start: "01-20",
			end: "02-18",
			compatibleWith: ["Gemini", "Libra", "Sagittarius", "Aries"],
			description:
				"Innovative, independent, and humanitarian. Aquarians are thinkers and dreamers.",
			element: "Air",
		},
		{
			name: "Pisces",
			start: "02-19",
			end: "03-20",
			compatibleWith: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
			description:
				"Compassionate, artistic, and intuitive. Pisces are empathetic and imaginative.",
			element: "Water",
		},
		{
			name: "Aries",
			start: "03-21",
			end: "04-19",
			compatibleWith: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
			description:
				"Energetic, courageous, and passionate. Aries are leaders and adventurers.",
			element: "Fire",
		},
		{
			name: "Taurus",
			start: "04-20",
			end: "05-20",
			compatibleWith: ["Cancer", "Virgo", "Capricorn", "Pisces"],
			description:
				"Reliable, patient, and sensual. Tauruses appreciate stability and comfort.",
			element: "Earth",
		},
		{
			name: "Gemini",
			start: "05-21",
			end: "06-20",
			compatibleWith: ["Aries", "Leo", "Libra", "Aquarius"],
			description:
				"Versatile, communicative, and witty. Geminis are curious and adaptable.",
			element: "Air",
		},
		{
			name: "Cancer",
			start: "06-21",
			end: "07-22",
			compatibleWith: ["Taurus", "Virgo", "Scorpio", "Pisces"],
			description:
				"Emotional, nurturing, and intuitive. Cancers are protective and caring.",
			element: "Water",
		},
		{
			name: "Leo",
			start: "07-23",
			end: "08-22",
			compatibleWith: ["Aries", "Gemini", "Libra", "Sagittarius"],
			description:
				"Confident, generous, and charismatic. Leos love attention and creativity.",
			element: "Fire",
		},
		{
			name: "Virgo",
			start: "08-23",
			end: "09-22",
			compatibleWith: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
			description:
				"Analytical, practical, and kind. Virgos are perfectionists and helpers.",
			element: "Earth",
		},
		{
			name: "Libra",
			start: "09-23",
			end: "10-22",
			compatibleWith: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
			description:
				"Diplomatic, fair, and social. Libras seek harmony and beauty.",
			element: "Air",
		},
		{
			name: "Scorpio",
			start: "10-23",
			end: "11-21",
			compatibleWith: ["Cancer", "Virgo", "Capricorn", "Pisces"],
			description:
				"Passionate, resourceful, and mysterious. Scorpios are intense and loyal.",
			element: "Water",
		},
		{
			name: "Sagittarius",
			start: "11-22",
			end: "12-21",
			compatibleWith: ["Aries", "Leo", "Libra", "Aquarius"],
			description:
				"Optimistic, freedom-loving, and philosophical. Sagittariuses are adventurers.",
			element: "Fire",
		},
	];

	const getZodiac = (dob: string): ZodiacSign | undefined => {
		const date = new Date(dob);
		const month = date.getMonth() + 1;
		const day = date.getDate();

		return zodiacSigns.find((sign) => {
			const [startMonth, startDay] = sign.start.split("-").map(Number);
			const [endMonth, endDay] = sign.end.split("-").map(Number);

			if (startMonth > endMonth) {
				return (
					(month === startMonth && day >= startDay) ||
					(month === endMonth && day <= endDay) ||
					month > startMonth ||
					month < endMonth
				);
			} else {
				return (
					(month === startMonth && day >= startDay) ||
					(month === endMonth && day <= endDay) ||
					(month > startMonth && month < endMonth)
				);
			}
		});
	};

	const getZodiacCompatibility = (
		zodiac1: ZodiacSign,
		zodiac2: ZodiacSign
	): number => {
		return zodiac1.compatibleWith.includes(zodiac2.name)
			? 25
			: zodiac1.element === zodiac2.element
			? 15
			: 5;
	};

	const getNameValue = (name: string): number => {
		return name
			.toUpperCase()
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	};

	const getAgeDifference = (dob1: string, dob2: string): number => {
		const age1 = new Date().getFullYear() - new Date(dob1).getFullYear();
		const age2 = new Date().getFullYear() - new Date(dob2).getFullYear();
		return Math.abs(age1 - age2);
	};

	const getLoveTips = (score: number): string[] => {
		if (score >= 90) {
			return [
				"Communicate openly and support each other's dreams.",
				"Plan romantic getaways to keep the spark alive.",
				"Celebrate small victories together.",
			];
		} else if (score >= 70) {
			return [
				"Work on understanding each other's perspectives.",
				"Try new activities together to build shared memories.",
				"Be patient and give each other space when needed.",
			];
		} else if (score >= 50) {
			return [
				"Focus on common interests and values.",
				"Seek couples counseling if challenges arise.",
				"Practice gratitude for what you have in common.",
			];
		} else {
			return [
				"Consider if this relationship aligns with your long-term goals.",
				"Be honest about your feelings and expectations.",
				"Don't force compatibility; sometimes friendship is better.",
			];
		}
	};

	const calculateCompatibility = (): void => {
		if (!name1 || !name2 || !gender1 || !gender2 || !dob1 || !dob2) {
			alert("Please fill in all fields!");
			return;
		}

		if (new Date(dob1) > new Date() || new Date(dob2) > new Date()) {
			alert("Please enter valid birthdates!");
			return;
		}

		setLoading(true);

		setTimeout(() => {
			const nameValue1 = getNameValue(name1);
			const nameValue2 = getNameValue(name2);
			const nameComp = 100 - (Math.abs(nameValue1 - nameValue2) % 100);

			const ageDifference = getAgeDifference(dob1, dob2);
			const ageComp = Math.max(100 - ageDifference * 2, 0);

			const zodiacSign1 = getZodiac(dob1);
			const zodiacSign2 = getZodiac(dob2);
			const zodiacComp =
				zodiacSign1 && zodiacSign2
					? getZodiacCompatibility(zodiacSign1, zodiacSign2)
					: 0;

			const genderComp = gender1 !== gender2 ? 15 : 10;

			const randomFactor = Math.floor(Math.random() * 21);

			const total = Math.round(
				(nameComp + ageComp + zodiacComp + genderComp + randomFactor) / 5
			);

			let compatibilityMessage = "";
			if (total >= 90) {
				compatibilityMessage =
					"Perfect match! Your love story is written in the stars! ✨";
			} else if (total >= 70) {
				compatibilityMessage =
					"Great compatibility! With effort, this could be amazing! 💕";
			} else if (total >= 50) {
				compatibilityMessage =
					"Decent match. Love requires work, but it's possible! 🤝";
			} else {
				compatibilityMessage =
					"Challenging compatibility. Friendship might be a better path! 🌟";
			}

			if (gender1 === gender2) {
				compatibilityMessage += " 🌈 Love knows no boundaries! 🏳️‍🌈";
			}

			setZodiac1(zodiacSign1?.name || "");
			setZodiac2(zodiacSign2?.name || "");
			setBreakdown({
				name: nameComp,
				age: ageComp,
				zodiac: zodiacComp,
				gender: genderComp,
				random: randomFactor,
				total,
			});
			setResult(total);
			setMessage(compatibilityMessage);
			setLoading(false);

			// Trigger confetti and generate shareable link
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 3000);
			generateShareableLink();
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

	const generateShareableLink = () => {
		if (!result || !name1 || !name2) return;

		const params = new URLSearchParams({
			n1: encodeURIComponent(name1),
			g1: gender1,
			d1: dob1,
			n2: encodeURIComponent(name2),
			g2: gender2,
			d2: dob2,
			r: result.toString(),
		});

		const basePath = getBasePath();
		const link = `${window.location.origin}${basePath}?${params.toString()}`;
		setShareableLink(link);
		return link;
	};

	const shareResults = async () => {
		if (!result) return;

		const shareText = `💕 ${name1} and ${name2} are ${result}% compatible! Check our Love Calculator: ${
			shareableLink || generateShareableLink()
		}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: "Love Calculator Results",
					text: shareText,
					url: shareableLink || generateShareableLink(),
				});
			} catch (err) {
				console.log("Share cancelled");
			}
		} else {
			copyToClipboard(shareText);
		}
	};

	const copyToClipboard = async (text?: string) => {
		const copyText =
			text ||
			`💕 ${name1} and ${name2} are ${result}% compatible! Check our Love Calculator: ${
				shareableLink || generateShareableLink()
			}`;

		try {
			await navigator.clipboard.writeText(copyText);
			setCopiedToClipboard(true);
			setTimeout(() => setCopiedToClipboard(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
			fallbackCopyTextToClipboard(copyText);
		}
	};

	const fallbackCopyTextToClipboard = (text: string) => {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand("copy");
			setCopiedToClipboard(true);
			setTimeout(() => setCopiedToClipboard(false), 2000);
		} catch (err) {
			console.error("Fallback: Oops, unable to copy", err);
		}
		document.body.removeChild(textArea);
	};

	const shareOnSocial = (platform: string) => {
		if (!result) return;

		const text = encodeURIComponent(
			`💕 ${name1} and ${name2} are ${result}% compatible!`
		);
		const url = encodeURIComponent(
			shareableLink || generateShareableLink() || window.location.href
		);

		let shareUrl = "";

		switch (platform) {
			case "facebook":
				shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
				break;
			case "twitter":
				shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
				break;
			case "whatsapp":
				shareUrl = `https://wa.me/?text=${text}%20${url}`;
				break;
		}

		if (shareUrl) {
			window.open(shareUrl, "_blank", "width=600,height=400");
		}
	};

	const printResults = () => {
		const printContent = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
				<h1 style="color: #ff6b9d;">💕 Love Calculator Results 💕</h1>
				<h2>${name1} ❤️ ${name2}</h2>
				<h3 style="font-size: 48px; color: #ff4757;">${result}% Compatible!</h3>
				<p style="font-style: italic; margin: 20px 0;">${message}</p>
				${
					zodiac1 && zodiac2
						? `<p><strong>Zodiac Signs:</strong> ${zodiac1} & ${zodiac2}</p>`
						: ""
				}
				${
					breakdown
						? `
					<div style="margin: 20px 0;">
						<h4>Compatibility Breakdown:</h4>
						<p>Names: ${breakdown.name}% | Age: ${breakdown.age}% | Zodiac: ${breakdown.zodiac}% | Gender: ${breakdown.gender}% | Magic: ${breakdown.random}%</p>
					</div>
				`
						: ""
				}
				<p style="margin-top: 30px; font-size: 12px; color: #666;">Generated by Love Calculator</p>
			</div>
		`;

		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(printContent);
			printWindow.document.close();
			printWindow.print();
		}
	};

	const downloadResults = () => {
		if (!result) return;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = 800;
		canvas.height = 600;

		// Create gradient background
		const gradient = ctx.createLinearGradient(0, 0, 800, 600);
		gradient.addColorStop(0, "#ff6b9d");
		gradient.addColorStop(0.5, "#c44569");
		gradient.addColorStop(1, "#6c5ce7");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 800, 600);

		// Add hearts pattern
		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
		for (let i = 0; i < 50; i++) {
			const x = Math.random() * 800;
			const y = Math.random() * 600;
			const size = Math.random() * 20 + 5;
			ctx.font = `${size}px Arial`;
			ctx.fillText("💖", x, y);
		}

		// Add text
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = "bold 48px Arial";
		ctx.fillText("Love Calculator", 400, 80);

		ctx.font = "bold 36px Arial";
		ctx.fillText(`${name1} ❤️ ${name2}`, 400, 140);

		ctx.font = "bold 72px Arial";
		ctx.fillText(`${result}%`, 400, 220);

		ctx.font = "24px Arial";
		ctx.fillText("Compatible!", 400, 260);

		if (zodiac1 && zodiac2) {
			ctx.font = "18px Arial";
			ctx.fillText(`Zodiac: ${zodiac1} & ${zodiac2}`, 400, 300);
		}

		ctx.font = "14px Arial";
		ctx.fillText("Generated by Love Calculator", 400, 550);

		// Download
		const link = document.createElement("a");
		link.download = `love-calculator-${name1}-${name2}.png`;
		link.href = canvas.toDataURL();
		link.click();
	};

	const getGenderIcon = (gender: string) => {
		switch (gender) {
			case "male":
				return <FaMars className="text-blue-500" />;
			case "female":
				return <FaVenus className="text-pink-500" />;
			default:
				return <FaGenderless className="text-purple-500" />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 relative overflow-hidden">
			{/* Floating hearts animation */}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(20)].map((_, i) => (
					<FaHeart
						key={i}
						className={`absolute text-white opacity-20 animate-bounce`}
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 2}s`,
							fontSize: `${Math.random() * 20 + 10}px`,
						}}
					/>
				))}
			</div>

			{/* Confetti animation */}
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
						{/* Person 1 */}
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
									<option value="nonbinary" className="text-gray-800">
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

						{/* Person 2 */}
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
									<option value="nonbinary" className="text-gray-800">
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

							{/* Zodiac Info */}
							{zodiac1 && zodiac2 && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
									<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
										<h4 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
											{getGenderIcon(gender1)} {name1}&apos;s Zodiac: {zodiac1}
										</h4>
										<p className="text-white/80 text-xs sm:text-sm">
											{zodiacSigns.find((z) => z.name === zodiac1)?.description}
										</p>
									</div>
									<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
										<h4 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
											{getGenderIcon(gender2)} {name2}&apos;s Zodiac: {zodiac2}
										</h4>
										<p className="text-white/80 text-xs sm:text-sm">
											{zodiacSigns.find((z) => z.name === zodiac2)?.description}
										</p>
									</div>
								</div>
							)}

							{/* Compatibility Breakdown */}
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
													{breakdown.gender}%
												</div>
												<div className="text-xs sm:text-sm text-white/70">
													Gender
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

							{/* Love Tips */}
							<div className="bg-white/5 p-3 sm:p-4 rounded-lg">
								<h4 className="text-base sm:text-lg font-semibold text-white mb-2">
									💡 Love Tips
								</h4>
								<ul className="text-white/80 text-xs sm:text-sm space-y-1">
									{getLoveTips(result).map((tip, index) => (
										<li key={index}>• {tip}</li>
									))}
								</ul>
							</div>

							{/* Share and Export Section */}
							<div className="bg-white/5 p-3 sm:p-4 rounded-lg mt-4">
								<h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center">
									<FaShare className="mr-2" /> Share Your Results
								</h4>

								{/* Social Media Buttons */}
								<div className="flex flex-wrap gap-2 mb-3">
									<button
										onClick={() => shareOnSocial("facebook")}
										className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Share on Facebook"
									>
										<FaFacebook className="mr-1" /> Facebook
									</button>
									<button
										onClick={() => shareOnSocial("twitter")}
										className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Share on Twitter"
									>
										<FaTwitter className="mr-1" /> Twitter
									</button>
									<button
										onClick={() => shareOnSocial("whatsapp")}
										className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Share on WhatsApp"
									>
										<FaWhatsapp className="mr-1" /> WhatsApp
									</button>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-2">
									<button
										onClick={shareResults}
										className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Share Results"
									>
										<FaShare className="mr-1" /> Share
									</button>
									<button
										onClick={() => copyToClipboard()}
										className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Copy to Clipboard"
									>
										<FaCopy className="mr-1" />
										{copiedToClipboard ? "Copied!" : "Copy"}
									</button>
									<button
										onClick={downloadResults}
										className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Download as Image"
									>
										<FaDownload className="mr-1" /> Download
									</button>
									<button
										onClick={printResults}
										className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-all flex items-center text-sm"
										title="Print Results"
									>
										<FaPrint className="mr-1" /> Print
									</button>
								</div>

								{/* Shareable Link */}
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
			</div>
		</div>
	);
}
