import { useState } from "react";
import { evaluate } from "mathjs";
import axios from "axios";

export default function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const [firstTerm, setFirstTerm] = useState(1);
  const [diffRatio, setDiffRatio] = useState(1);
  const [count, setCount] = useState(5);
  const [sequence, setSequence] = useState([]);

  const [wordProblem, setWordProblem] = useState("");
  const [wordAnswer, setWordAnswer] = useState("");
  const [wpLoading, setWpLoading] = useState(false);

  const evaluateExpression = () => {
    try {
      const r = evaluate(expression);
      setResult(String(r));
    } catch (e) {
      setResult("Error");
    }
  };

  const generateArithmetic = () => {
    const a = Number(firstTerm);
    const d = Number(diffRatio);
    const n = Math.max(0, Number(count) || 0);
    const seq = Array.from({ length: n }, (_, i) => a + i * d);
    setSequence(seq);
  };

  const generateGeometric = () => {
    const a = Number(firstTerm);
    const r = Number(diffRatio);
    const n = Math.max(0, Number(count) || 0);
    const seq = Array.from({ length: n }, (_, i) => a * r ** i);
    setSequence(seq);
  };

  const solveWordProblem = async () => {
    if (!wordProblem.trim()) return;
    setWpLoading(true);
    try {
      const response = await axios.post("/api/solveWordProblem", { problem: wordProblem });
      setWordAnswer(response.data.answer);
    } catch (err) {
      setWordAnswer("Error solving problem or limit reached.");
    }
    setWpLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">📐 Amath Solver</h1>
        <p className="text-gray-600 mt-2">Calculator, sequences, and word problem solver</p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <section className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl mb-4">Calculator</h2>
          <div className="flex gap-2 mb-3">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Enter expression (e.g., 2+3*4)"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
            <button onClick={evaluateExpression} className="bg-blue-600 text-white px-4 rounded">Solve</button>
          </div>
          <p>Result: <span className="font-bold">{result}</span></p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-2xl mb-4">Sequences</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input type="number" className="border rounded px-2 py-1" value={firstTerm}
                   onChange={(e) => setFirstTerm(e.target.value)} placeholder="First term" />
            <input type="number" className="border rounded px-2 py-1" value={diffRatio}
                   onChange={(e) => setDiffRatio(e.target.value)} placeholder="Diff / Ratio" />
            <input type="number" className="border rounded px-2 py-1" value={count}
                   onChange={(e) => setCount(e.target.value)} placeholder="# terms" />
          </div>
          <div className="flex gap-2 mb-3">
            <button onClick={generateArithmetic} className="px-3 py-1 border rounded">Arithmetic</button>
            <button onClick={generateGeometric} className="px-3 py-1 border rounded">Geometric</button>
          </div>
          {sequence.length > 0 && <p>Sequence: <span className="font-mono">{sequence.join(", ")}</span></p>}
        </section>

        <section className="p-6 bg-white rounded-2xl shadow md:col-span-2">
          <h2 className="text-2xl mb-4">Word Problem Solver (Max 5/day)</h2>
          <textarea
            className="w-full border rounded px-3 py-2 mb-3"
            rows="3"
            placeholder="Enter your word problem"
            value={wordProblem}
            onChange={(e) => setWordProblem(e.target.value)}
          />
          <button onClick={solveWordProblem} className="bg-green-600 text-white px-4 py-2 rounded mb-3" disabled={wpLoading}>
            {wpLoading ? "Solving..." : "Solve Problem"}
          </button>
          {wordAnswer && <p>Answer: <span className="font-mono">{wordAnswer}</span></p>}
        </section>
      </main>

      <footer className="text-center mt-6 p-4 text-gray-600 border-t">
        Founder: Andy Chen | Contact: <a href="mailto:andychen89766@gmail.com" className="text-blue-600">andychen89766@gmail.com</a>
      </footer>
    </div>
  );
}