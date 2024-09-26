// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "chart.js/auto";
import "./App.css";

function App() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [birthday1, setBirthday1] = useState("");
  const [birthday2, setBirthday2] = useState("");
  const [gender1, setGender1] = useState("");
  const [gender2, setGender2] = useState("");
  const [compatibility, setCompatibility] = useState(null);
  const [history, setHistory] = useState([]);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    const requiredFields = [
      { field: name1, key: "name1", message: "Nama Anda harus diisi." },
      {
        field: name2,
        key: "name2",
        message: "Nama pasangan Anda harus diisi.",
      },
      {
        field: birthday1,
        key: "birthday1",
        message: "Tanggal lahir Anda diperlukan.",
      },
      {
        field: birthday2,
        key: "birthday2",
        message: "Tanggal lahir pasangan Anda diperlukan.",
      },
      { field: gender1, key: "gender1", message: "Pilih jenis kelamin Anda." },
      {
        field: gender2,
        key: "gender2",
        message: "Pilih jenis kelamin pasangan Anda.",
      },
    ];

    requiredFields.forEach(({ field, key, message }) => {
      if (!field.trim()) newErrors[key] = message;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
  };

  const calculateCompatibility = () => {
    if (!validateInputs()) return;

    const vowelCount = (str) => (str.match(/[aeiou]/gi) || []).length;
    const nameScore =
      ((vowelCount(name1) + vowelCount(name2)) /
        (name1.length + name2.length)) *
      50;

    const ageDifference = calculateDaysDifference(birthday1, birthday2);
    const ageScore = Math.max(0, 100 - (ageDifference / 365) * 50);

    const totalScore = Math.floor(nameScore + ageScore);
    setCompatibility(totalScore);

    const message = generateMessage(gender1, gender2);
    setHistory([...history, { name1, name2, score: totalScore, message }]);
  };

  const generateMessage = (gender1, gender2) => {
    if (gender1 === gender2) {
      return generateJoke(gender1, gender2);
    }
    return "Yang berlawanan menarik! Cinta tidak mengenal batas. 💕";
  };

  const generateJoke = (gender1, gender2) => {
    if (gender1 === "Laki-laki" && gender2 === "Perempuan") {
      return "Kalian pasangan yang sempurna! Jangan lupa, jaga romansa seperti jaga makanan pedas, ya!";
    } else if (gender1 === "Perempuan" && gender2 === "Laki-laki") {
      return "Kalian pasangan yang sempurna! Semoga tidak berantem soal siapa yang lebih bisa masak!";
    } else if (gender1 === "Laki-laki" && gender2 === "Laki-laki") {
      return "Lah, kalian gay?";
    } else if (gender1 === "Perempuan" && gender2 === "Perempuan") {
      return "Lah, kalian lesbian?";
    } else {
      return "Lah, kalian mau jadi pasangan mana?";
    }
  };

  const heartColor =
    compatibility >= 80
      ? "text-red-500"
      : compatibility >= 50
      ? "text-yellow-400"
      : "text-gray-400";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-400 to-purple-600 p-4">
      <h1 className="text-5xl font-bold text-white mb-6">
        Kalkulator Kecocokan Cinta
      </h1>

      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Masukkan Informasi Anda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User 1 Info */}
          <div>
            <input
              type="text"
              placeholder="Nama Anda"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className={`w-full p-3 border ${
                errors.name1 ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-2`}
            />
            {errors.name1 && (
              <p className="text-red-500 text-sm">{errors.name1}</p>
            )}

            <select
              value={gender1}
              onChange={(e) => setGender1(e.target.value)}
              className={`w-full p-3 border ${
                errors.gender1 ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-2`}
            >
              <option value="" disabled>
                Pilih Jenis Kelamin Anda
              </option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.gender1 && (
              <p className="text-red-500 text-sm">{errors.gender1}</p>
            )}

            <input
              type="date"
              value={birthday1}
              onChange={(e) => setBirthday1(e.target.value)}
              className={`w-full p-3 border ${
                errors.birthday1 ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.birthday1 && (
              <p className="text-red-500 text-sm">{errors.birthday1}</p>
            )}
          </div>

          {/* User 2 Info */}
          <div>
            <input
              type="text"
              placeholder="Nama Pasangan"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className={`w-full p-3 border ${
                errors.name2 ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-2`}
            />
            {errors.name2 && (
              <p className="text-red-500 text-sm">{errors.name2}</p>
            )}

            <select
              value={gender2}
              onChange={(e) => setGender2(e.target.value)}
              className={`w-full p-3 border ${
                errors.gender2 ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-2`}
            >
              <option value="" disabled>
                Pilih Jenis Kelamin Pasangan
              </option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.gender2 && (
              <p className="text-red-500 text-sm">{errors.gender2}</p>
            )}

            <input
              type="date"
              value={birthday2}
              onChange={(e) => setBirthday2(e.target.value)}
              className={`w-full p-3 border ${
                errors.birthday2 ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
            {errors.birthday2 && (
              <p className="text-red-500 text-sm">{errors.birthday2}</p>
            )}
          </div>
        </div>

        <button
          onClick={calculateCompatibility}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Hitung Kecocokan
        </button>
      </div>

      {/* Display Compatibility Result */}
      {compatibility !== null && (
        <div className="fade-in mt-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
          <h3 className="text-xl font-bold text-center mb-4">
            Hasil Kecocokan
          </h3>
          <div className={`animate-pulse text-6xl ${heartColor} mb-4`}>❤️</div>
          <p className="text-center text-3xl text-purple-600 font-bold">
            {compatibility}%
          </p>
          <p className="text-center mt-4">
            {compatibility > 80
              ? "Cocok sekali! 💖"
              : compatibility > 50
              ? "Hubungan yang baik!"
              : "Mungkin perlu sedikit kerja keras..."}
          </p>
          <p className="text-center mt-4 text-lg text-gray-700">
            {history[history.length - 1]?.message} {/* Display the message */}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
