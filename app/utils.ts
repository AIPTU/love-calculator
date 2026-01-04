import { ZodiacSign } from "./types";
import { ZODIAC_SIGNS, ELEMENT_COMPATIBILITY } from "./constants";

export const getBasePath = () => {
    if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const match = pathname.match(/^\/([^\/]+)/);
        if (match && match[1] && !pathname.startsWith("/?")) {
            return `/${match[1]}`;
        }
    }
    return "";
};

export const getZodiac = (dob: string): ZodiacSign | undefined => {
    const date = new Date(dob);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return ZODIAC_SIGNS.find((sign) => {
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

export const calculateNameCompatibility = (name1: string, name2: string): number => {
    const n1 = name1.toLowerCase().trim();
    const n2 = name2.toLowerCase().trim();

    const getCharFreq = (name: string) => {
        const freq: { [key: string]: number } = {};
        for (const char of name.replace(/\s/g, "")) {
            freq[char] = (freq[char] || 0) + 1;
        }
        return freq;
    };

    const freq1 = getCharFreq(n1);
    const freq2 = getCharFreq(n2);

    let commonChars = 0;
    let totalChars = 0;

    const allChars = Array.from(new Set([...Object.keys(freq1), ...Object.keys(freq2)]));
    for (const char of allChars) {
        const min = Math.min(freq1[char] || 0, freq2[char] || 0);
        const max = Math.max(freq1[char] || 0, freq2[char] || 0);
        commonChars += min;
        totalChars += max;
    }

    const similarity = totalChars > 0 ? (commonChars / totalChars) * 100 : 50;
    const lengthDiff = Math.abs(n1.length - n2.length);
    const lengthScore = Math.max(0, 100 - lengthDiff * 10);

    return Math.round(similarity * 0.6 + lengthScore * 0.4);
};

export const calculateAgeCompatibility = (dob1: string, dob2: string): number => {
    const age1 = new Date().getFullYear() - new Date(dob1).getFullYear();
    const age2 = new Date().getFullYear() - new Date(dob2).getFullYear();
    const ageDiff = Math.abs(age1 - age2);

    if (ageDiff <= 5) return 100;
    if (ageDiff <= 10) return 85;
    if (ageDiff <= 15) return 70;
    if (ageDiff <= 20) return 55;
    return Math.max(30, 100 - ageDiff * 3);
};

export const calculateZodiacCompatibility = (zodiac1: ZodiacSign, zodiac2: ZodiacSign): number => {
    if (zodiac1.compatibleWith.includes(zodiac2.name)) return 100;
    if (zodiac1.name === zodiac2.name) return 85;
    if (zodiac1.element === zodiac2.element) return 75;

    const complementary: { [key: string]: string[] } = {
        Fire: ["Air"],
        Air: ["Fire"],
        Earth: ["Water"],
        Water: ["Earth"],
    };

    if (complementary[zodiac1.element]?.includes(zodiac2.element)) return 60;
    return 40;
};

export const calculateElementCompatibility = (zodiac1: ZodiacSign, zodiac2: ZodiacSign): number => {
    if (zodiac1.element === zodiac2.element) return 100;
    return ELEMENT_COMPATIBILITY[zodiac1.element]?.[zodiac2.element] || 50;
};

export const getConsistentRandom = (
    name1: string,
    name2: string,
    dob1: string,
    dob2: string
): number => {
    const combined = `${name1}${name2}${dob1}${dob2}`.toLowerCase();
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return Math.abs(hash % 21);
};

export const getCompatibilityMessage = (score: number, gender1: string, gender2: string): string => {
    let msg = "";

    if (score >= 90) {
        msg = "Perfect match! Your love story is written in the stars! ✨";
    } else if (score >= 75) {
        msg = "Excellent compatibility! This could be something truly special! 💕";
    } else if (score >= 60) {
        msg = "Great potential! With effort and communication, this could thrive! 💖";
    } else if (score >= 45) {
        msg = "Decent match. Love requires work, but it's definitely possible! 🤝";
    } else if (score >= 30) {
        msg = "Challenging compatibility. It will take extra effort to make it work! 💪";
    } else {
        msg = "Difficult match. Friendship might be a better path to explore! 🌟";
    }

    if (gender1 === gender2 && gender1 !== "" && gender2 !== "") {
        msg += " 🌈 Love knows no boundaries! 🏳️‍🌈";
    }

    return msg;
};

export const getLoveTips = (score: number): string[] => {
    if (score >= 80) {
        return [
            "Maintain open and honest communication at all times.",
            "Plan regular date nights and romantic getaways together.",
            "Support each other's personal growth and dreams.",
            "Celebrate both big achievements and small daily victories.",
        ];
    } else if (score >= 60) {
        return [
            "Work actively on understanding each other's perspectives.",
            "Try new activities together to create shared experiences.",
            "Practice patience and give space when emotions run high.",
            "Focus on building emotional intimacy through quality time.",
        ];
    } else if (score >= 40) {
        return [
            "Identify and nurture your common interests and values.",
            "Consider couples counseling to navigate challenges together.",
            "Practice daily gratitude for what you appreciate in each other.",
            "Set clear boundaries and respect each other's individuality.",
        ];
    } else {
        return [
            "Reflect honestly on whether your long-term goals align.",
            "Be transparent about your feelings and expectations.",
            "Don't force compatibility - sometimes friendship is healthier.",
            "Trust your instincts and prioritize your emotional well-being.",
        ];
    }
};