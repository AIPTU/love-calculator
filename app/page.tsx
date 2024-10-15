"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";

interface ZodiacSign {
	name: string;
	start: string;
	end: string;
	compatibleWith: string[];
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

	const zodiacSigns: ZodiacSign[] = [
		{
			name: "Capricorn",
			start: "12-22",
			end: "01-19",
			compatibleWith: ["Taurus", "Virgo", "Scorpio", "Pisces"],
		},
		{
			name: "Aquarius",
			start: "01-20",
			end: "02-18",
			compatibleWith: ["Gemini", "Libra", "Sagittarius", "Aries"],
		},
		{
			name: "Pisces",
			start: "02-19",
			end: "03-20",
			compatibleWith: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
		},
		{
			name: "Aries",
			start: "03-21",
			end: "04-19",
			compatibleWith: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
		},
		{
			name: "Taurus",
			start: "04-20",
			end: "05-20",
			compatibleWith: ["Cancer", "Virgo", "Capricorn", "Pisces"],
		},
		{
			name: "Gemini",
			start: "05-21",
			end: "06-20",
			compatibleWith: ["Aries", "Leo", "Libra", "Aquarius"],
		},
		{
			name: "Cancer",
			start: "06-21",
			end: "07-22",
			compatibleWith: ["Taurus", "Virgo", "Scorpio", "Pisces"],
		},
		{
			name: "Leo",
			start: "07-23",
			end: "08-22",
			compatibleWith: ["Aries", "Gemini", "Libra", "Sagittarius"],
		},
		{
			name: "Virgo",
			start: "08-23",
			end: "09-22",
			compatibleWith: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
		},
		{
			name: "Libra",
			start: "09-23",
			end: "10-22",
			compatibleWith: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
		},
		{
			name: "Scorpio",
			start: "10-23",
			end: "11-21",
			compatibleWith: ["Cancer", "Virgo", "Capricorn", "Pisces"],
		},
		{
			name: "Sagittarius",
			start: "11-22",
			end: "12-21",
			compatibleWith: ["Aries", "Leo", "Libra", "Aquarius"],
		},
	];

	const getZodiac = (dob: string): string => {
		const date = new Date(dob);
		const month = date.getMonth() + 1;
		const day = date.getDate();

		return (
			zodiacSigns.find((sign) => {
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
			})?.name || ""
		);
	};

	const getZodiacCompatibility = (zodiac1: string, zodiac2: string): number => {
		const sign1 = zodiacSigns.find((z) => z.name === zodiac1);
		if (!sign1) return 0;

		return sign1.compatibleWith.includes(zodiac2) ? 20 : 0;
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
			const nameCompatibility = 100 - (Math.abs(nameValue1 - nameValue2) % 100);

			const ageDifference = getAgeDifference(dob1, dob2);
			const ageCompatibility = Math.max(100 - ageDifference * 3, 0);

			const zodiac1 = getZodiac(dob1);
			const zodiac2 = getZodiac(dob2);
			const zodiacCompatibility = getZodiacCompatibility(zodiac1, zodiac2);

			const genderCompatibility = gender1 !== gender2 ? 10 : 5;

			const randomFactor = Math.floor(Math.random() * 21);

			const totalCompatibility =
				(nameCompatibility +
					ageCompatibility +
					zodiacCompatibility +
					genderCompatibility +
					randomFactor) /
				5;

			const roundedResult = Math.round(totalCompatibility);

			let compatibilityMessage = "";
			if (roundedResult >= 90) {
				compatibilityMessage =
					"Kalian adalah pasangan yang sempurna! Seperti dua potong puzzle yang hilang!";
			} else if (roundedResult >= 70) {
				compatibilityMessage =
					"Kalian sangat cocok! Sepertinya ada masa depan cerah menanti.";
			} else if (roundedResult >= 50) {
				compatibilityMessage =
					"Kalian cukup cocok, tapi mungkin harus saling memahami lebih dalam.";
			} else {
				compatibilityMessage =
					"Mungkin ini bukan cinta sejati, tapi siapa tahu jika kalian terus mencoba!";
			}

			if (gender1 === gender2) {
				compatibilityMessage +=
					" 🏳️‍🌈 Pasangan LGBT detected! Kalian adalah bukti bahwa cinta itu bebas! 😍";
			}

			setResult(roundedResult);
			setMessage(compatibilityMessage);
			setLoading(false);
		}, 1000);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32">
			<h1 className="text-5xl font-extrabold text-white mb-10 animate-bounce">
				Love Calculator{" "}
				<FaHeart className="inline-block text-red-500 animate-pulse" />
			</h1>

			<div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transition-all transform hover:scale-105">
				<h2 className="text-3xl font-semibold mb-6 text-gray-800">Your Info</h2>
				<input
					type="text"
					aria-label="Your Name"
					placeholder="Your Name"
					className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={name1}
					onChange={(e) => setName1(e.target.value)}
				/>
				<select
					aria-label="Your Gender"
					className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={gender1}
					onChange={(e) => setGender1(e.target.value)}
				>
					<option value="">Your Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="nonbinary">Non-Binary</option>
				</select>
				<input
					type="date"
					aria-label="Your Date of Birth"
					placeholder="Your Date of Birth"
					className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={dob1}
					onChange={(e) => setDob1(e.target.value)}
				/>

				<h2 className="text-3xl font-semibold mb-6 text-gray-800">
					Partner&apos;s Info
				</h2>
				<input
					type="text"
					aria-label="Partner's Name"
					placeholder="Partner's Name"
					className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={name2}
					onChange={(e) => setName2(e.target.value)}
				/>
				<select
					aria-label="Partner's Gender"
					className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={gender2}
					onChange={(e) => setGender2(e.target.value)}
				>
					<option value="">Partner&apos;s Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="nonbinary">Non-Binary</option>
				</select>
				<input
					type="date"
					aria-label="Partner's Date of Birth"
					placeholder="Partner's Date of Birth"
					className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={dob2}
					onChange={(e) => setDob2(e.target.value)}
				/>

				<button
					className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-lg text-xl font-semibold hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
					onClick={calculateCompatibility}
					disabled={loading}
				>
					{loading ? "Calculating..." : "Calculate Love Compatibility"}
				</button>

				{result !== null && (
					<div className="mt-8 text-center">
						<h3 className="text-4xl font-bold text-purple-800 mb-4 animate-fade-in">
							{result}% Compatibility!
						</h3>
						<p className="text-lg text-gray-700 font-medium">{message}</p>
					</div>
				)}
			</div>
		</div>
	);
}
