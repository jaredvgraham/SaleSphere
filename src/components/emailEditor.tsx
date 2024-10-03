"use client";

import React, { useCallback, useMemo, useState, useRef } from "react";
import { createEditor, Descendant, Text, Element as SlateElement } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

// Define a custom element type
type CustomElement = { type: "paragraph"; children: Descendant[] };

// Ensure that Slate accepts a valid initial value
const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Start writing your sales email here..." }],
  },
];

export default function SalesEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout ID
  const lastContent = useRef<string>(""); // Ref to store the last content state

  // Function to send API requests
  const fetchSuggestions = async (emailText: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/email-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText }),
      });

      const data = await response.json();
      setSuggestions(data.suggestions.split("\n"));
    } catch (error) {
      console.error("Error fetching suggestions", error);
      setSuggestions(["Error fetching suggestions"]);
    }
    setLoading(false);
  };

  // Custom logic for extracting text from Slate and triggering suggestions
  const handleSuggestions = useCallback(
    (value: Descendant[]) => {
      // Clear the previous debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Extract the plain text from the editor state
      const emailText = value
        .map((node) => {
          if (Text.isText(node)) {
            return node.text; // For text nodes, return the text
          } else if (SlateElement.isElement(node)) {
            return node.children
              .map((child) => (Text.isText(child) ? child.text : ""))
              .join("");
          }
          return "";
        })
        .join(" ");

      // Only trigger suggestions if the content has changed
      if (emailText !== lastContent.current) {
        lastContent.current = emailText; // Update last content state
        debounceTimer.current = setTimeout(() => {
          fetchSuggestions(emailText);
        }, 500); // 500ms debounce delay
      }
    },
    [fetchSuggestions]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Sales Email Assistant</h1>

      {/* Slate Editor */}
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(newValue) => {
          handleSuggestions(newValue); // Trigger suggestions on each content change
        }}
      >
        <Editable
          placeholder="Start writing your email..."
          className="w-full max-w-2xl p-4 border border-gray-300 rounded-lg mb-4"
        />
      </Slate>

      {/* Suggestions Section */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Suggestions:</h2>
        {loading ? (
          <p>Loading suggestions...</p>
        ) : suggestions.length > 0 ? (
          <ul className="list-disc pl-5">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-red-600">
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">Looks good! No suggestions for now.</p>
        )}
      </div>
    </div>
  );
}
