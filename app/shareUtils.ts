import { CompatibilityBreakdown } from "./types";
import { getBasePath } from "./utils";

const compactEncode = (data: {
    gender1: string;
    gender2: string;
    dob1: string;
    dob2: string;
    result: number;
}): string => {
    const d1Compact = parseInt(data.dob1.replace(/-/g, "")).toString(36);
    const d2Compact = parseInt(data.dob2.replace(/-/g, "")).toString(36);

    const g1 = data.gender1[0] === "m" ? "0" : data.gender1[0] === "f" ? "1" : "2";
    const g2 = data.gender2[0] === "m" ? "0" : data.gender2[0] === "f" ? "1" : "2";

    const r = data.result.toString(36);

    return `${g1}${g2}${d1Compact}${d2Compact}${r}`;
};

const compactDecode = (encoded: string): {
    g1: string;
    g2: string;
    d1: string;
    d2: string;
    r: number;
} | null => {
    try {
        const g1Code = encoded[0];
        const g2Code = encoded[1];

        let remaining = encoded.substring(2);

        let resultPart = "";
        let datesPart = "";

        if (remaining.length > 10) {
            resultPart = remaining.substring(remaining.length - 2);
            datesPart = remaining.substring(0, remaining.length - 2);
        } else {
            resultPart = remaining.substring(remaining.length - 1);
            datesPart = remaining.substring(0, remaining.length - 1);
        }

        const midPoint = Math.floor(datesPart.length / 2);
        const d1Base36 = datesPart.substring(0, midPoint);
        const d2Base36 = datesPart.substring(midPoint);

        const d1Num = parseInt(d1Base36, 36).toString().padStart(8, '0');
        const d2Num = parseInt(d2Base36, 36).toString().padStart(8, '0');

        const d1 = `${d1Num.substring(0, 4)}-${d1Num.substring(4, 6)}-${d1Num.substring(6, 8)}`;
        const d2 = `${d2Num.substring(0, 4)}-${d2Num.substring(4, 6)}-${d2Num.substring(6, 8)}`;

        const genderMap: Record<string, string> = { "0": "m", "1": "f", "2": "n" };
        const g1 = genderMap[g1Code] || "m";
        const g2 = genderMap[g2Code] || "m";

        const r = parseInt(resultPart, 36);

        console.log('Decoded:', { g1, g2, d1, d2, r });

        return { g1, g2, d1, d2, r };
    } catch (error) {
        console.error('Decode error:', error);
        return null;
    }
};

const createChecksum = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 2)
        .reduce((acc, byte) => acc + byte.toString(36).padStart(2, '0'), '')
        .substring(0, 3);
};

export const generateShareableLink = async (
    name1: string,
    name2: string,
    gender1: string,
    gender2: string,
    dob1: string,
    dob2: string,
    result: number
): Promise<string> => {
    const compact = compactEncode({ gender1, gender2, dob1, dob2, result });
    const checksum = await createChecksum(compact);
    const encoded = `${compact}${checksum}`;

    return `${window.location.origin}${window.location.pathname}#${encoded}`;
};

export const decodeShareableLink = async (encoded: string): Promise<{
    d1: string;
    d2: string;
    g1: string;
    g2: string;
    r: number;
} | null> => {
    if (encoded.length < 10) return null;

    try {
        const checksumLength = 3;
        const data = encoded.substring(0, encoded.length - checksumLength);
        const checksum = encoded.substring(encoded.length - checksumLength);

        const expectedChecksum = await createChecksum(data);

        console.log('Checksum verification:', {
            received: checksum,
            expected: expectedChecksum,
            match: checksum === expectedChecksum
        });

        if (checksum !== expectedChecksum) {
            console.error('Checksum mismatch');
            return null;
        }

        return compactDecode(data);
    } catch (error) {
        console.error('Decode error:', error);
        return null;
    }
};

export const shareResults = async (
    name1: string,
    name2: string,
    result: number,
    shareableLink: string
) => {
    const shareText = `💕 ${name1} and ${name2} are ${result}% compatible!`;

    if (!navigator.share) return;

    try {
        await navigator.share({
            title: "Love Calculator Results",
            text: shareText,
            url: shareableLink,
        });
    } catch {
        console.log("Share cancelled");
    }
};

export const copyToClipboard = async (
    name1: string,
    name2: string,
    result: number,
    shareableLink: string,
    setCopiedCallback: (copied: boolean) => void
) => {
    const text = `💕 ${name1} and ${name2} are ${result}% compatible! ${shareableLink}`;

    try {
        await navigator.clipboard.writeText(text);
        setCopiedCallback(true);
        setTimeout(() => setCopiedCallback(false), 2000);
    } catch {
        fallbackCopyTextToClipboard(text, setCopiedCallback);
    }
};

const fallbackCopyTextToClipboard = (
    text: string,
    setCopiedCallback: (copied: boolean) => void
) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopiedCallback(true);
    setTimeout(() => setCopiedCallback(false), 2000);
};

type SocialPlatform = "facebook" | "twitter" | "whatsapp";

export const shareOnSocial = (
    platform: SocialPlatform,
    name1: string,
    name2: string,
    result: number,
    shareableLink: string
) => {
    const text = encodeURIComponent(
        `💕 ${name1} and ${name2} are ${result}% compatible!`
    );
    const url = encodeURIComponent(shareableLink);

    const map: Record<SocialPlatform, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    window.open(map[platform], "_blank", "width=600,height=400");
};

export const printResults = (
    name1: string,
    name2: string,
    result: number,
    message: string,
    zodiac1: string,
    zodiac2: string,
    breakdown: CompatibilityBreakdown | null
) => {
    const printContent = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
			<h1 style="color: #ff6b9d;">💕 Love Calculator Results 💕</h1>
			<h2>${name1} ❤️ ${name2}</h2>
			<h3 style="font-size: 48px; color: #ff4757;">${result}% Compatible!</h3>
			<p style="font-style: italic; margin: 20px 0;">${message}</p>
			${zodiac1 && zodiac2 ? `<p><strong>Zodiac Signs:</strong> ${zodiac1} & ${zodiac2}</p>` : ""}
			${breakdown
            ? `
				<div style="margin: 20px 0;">
					<h4>Compatibility Breakdown:</h4>
					<p>Names: ${breakdown.name}% | Age: ${breakdown.age}% | Zodiac: ${breakdown.zodiac}% | Element: ${breakdown.element}% | Magic: ${breakdown.random}%</p>
				</div>
			`
            : ""
        }
			<p style="margin-top: 30px; font-size: 12px; color: #666;">Generated by Love Calculator</p>
			<p style="font-size: 10px; color: #999;">© ${new Date().getFullYear()} Love Calculator. For entertainment purposes only.</p>
		</div>
	`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
};

export const downloadResults = (
    name1: string,
    name2: string,
    result: number,
    zodiac1: string,
    zodiac2: string
) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#ff6b9d");
    gradient.addColorStop(0.5, "#c44569");
    gradient.addColorStop(1, "#6c5ce7");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const size = Math.random() * 20 + 5;
        ctx.font = `${size}px Arial`;
        ctx.fillText("💖", x, y);
    }

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
    ctx.fillText("Generated by Love Calculator", 400, 540);
    ctx.font = "12px Arial";
    ctx.fillText(`© ${new Date().getFullYear()} - For entertainment only`, 400, 560);

    const link = document.createElement("a");
    link.download = `love-calculator-${name1}-${name2}.png`;
    link.href = canvas.toDataURL();
    link.click();
};