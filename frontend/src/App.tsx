import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://cover-letter-generator-qyle.onrender.com/generate-templates"; // Update this


function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [templates, setTemplates] = useState<string[]>([]);
  const [finalLetter, setFinalLetter] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const generateTemplates = async () => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/generate-templates`, {
      job_description: jobDescription,
      resume,
    });
    const split = res.data.templates.split(/Option \d:/).filter(Boolean).map((t: string) => t.trim());
    setTemplates(split);
    setStep(2);
    setLoading(false);
  };

  const selectTemplate = async (selected: string) => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/generate-final`, {
      selected_template: selected,
      job_description: jobDescription,
      resume,
    });
    setFinalLetter(res.data.final_cover_letter);
    setStep(3);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Cover Letter Generator</h1>

      {step === 1 && (
        <>
          <textarea
            placeholder="Paste Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border p-3 mb-4 h-40"
          />
          <textarea
            placeholder="Paste Resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full border p-3 mb-4 h-40"
          />
          <button
            onClick={generateTemplates}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            {loading ? "Generating..." : "Generate Templates"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Choose One Template:</h2>
          {templates.map((template, index) => (
            <div key={index} className="border p-4 mb-4">
              <pre className="whitespace-pre-wrap">{template}</pre>
              <button
                onClick={() => selectTemplate(template)}
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
              >
                Select This Template
              </button>
            </div>
          ))}
        </>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Final Cover Letter:</h2>
          <pre className="whitespace-pre-wrap border p-4">{finalLetter}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
