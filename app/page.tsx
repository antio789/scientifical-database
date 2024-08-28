"use client"

import { useState,useEffect } from "react";

interface Fields {
  [key: string]: Fields | string[];
}
/*
const RenderFields = ({ data }: { data: Fields }) => {
  return (
    <ul className="ml-4 list-disc">
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <h3 className="text-xl">{key}</h3>
          {Array.isArray(value) ? (
            value.length > 0 ? (
              <ul className="ml-4 list-circle">
                {value.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            ) : null
          ) : (
            <RenderFields data={value} /> // Recursively render nested objects
          )}
        </li>
      ))}
    </ul>
  );
};
*/
const Home = () => {
  const [data, setData] = useState<Fields | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedSubField, setSelectedSubField] = useState<string | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/fields");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await res.json();
        setData(json.fields);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value);
    setSelectedSubField(null); // Reset subfield on field change
    setSelectedInterest(null); // Reset interest on field change
  };

  const handleSubFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubField(e.target.value);
    setSelectedInterest(null); // Reset interest on subfield change
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInterest(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-8">Scientific Database</h1>
      <h2>Early demonstration build, not representative of a finished product</h2>
      </header>
      
      {data && (
        <>
          {/* Dropdown for Field Category */}
          <select
            value={selectedField ?? ""}
            onChange={handleFieldChange}
            className="mb-4 p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select Field Category
            </option>
            {Object.keys(data).map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>

          {/* Dropdown for Research Field */}
          {selectedField && typeof data[selectedField] === "object" && (
            <select
              value={selectedSubField ?? ""}
              onChange={handleSubFieldChange}
              className="mb-4 p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select Research Field
              </option>
              {Object.keys(data[selectedField] as Fields).map((subField) => (
                <option key={subField} value={subField}>
                  {subField}
                </option>
              ))}
            </select>
          )}

          {/* Dropdown for Field of Interest */}
          {selectedSubField &&
            selectedField &&
            typeof (data[selectedField] as Fields)[selectedSubField] ===
              "object" && (
              <select
                value={selectedInterest ?? ""}
                onChange={handleInterestChange}
                className="mb-4 p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Field of Interest
                </option>
                {Object.keys(
                  (data[selectedField] as Fields)[selectedSubField] as Fields
                ).map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            )}

          {/* Button to proceed to the selected interest's details */}
          {selectedInterest && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                // Redirect logic based on selection
                window.location.href = `/results/${encodeURIComponent(
                  selectedInterest
                )}`;
              }}
            >
              See Details for {selectedInterest}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;