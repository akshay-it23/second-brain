// CreateContentModal.tsx

import axios from "axios";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ContentType =
  | "youtube"
  | "twitter"
  | "instagram"
  | "spotify"
  | "pinterest"
  | "facebook"
  | "gallery"
  | "linkedin";

const CONTENT_TYPE_VALUES: ContentType[] = [
  "youtube",
  "twitter",
  "instagram",
  "spotify",
  "pinterest",
  "facebook",
  "gallery",
  "linkedin",
];

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>("youtube");
  const [loading, setLoading] = useState(false);

  async function addContent() {
    const title = titleRef.current?.value?.trim();
    const link = linkRef.current?.value?.trim();

    if (!title || !link) {
      toast.error("⚠️ Please fill in all details!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        { link, title, type },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      toast.success("✅ Content added successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error("❌ Failed to add content. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null; // Avoid rendering if not open

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
        <div className="relative bg-slate-900 p-6 rounded-xl shadow-lg text-white w-96 z-50">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
            >
              <CrossIcon />
            </button>
          </div>

          {/* Modal Title */}
          <h2 className="text-2xl font-semibold text-center mb-6">
            Add New Content
          </h2>

          {/* Input Fields */}
          <div className="space-y-4">
            <Input
              ref={titleRef}
              placeholder="Enter your title"
              className="bg-gray-800 text-white border-gray-600 w-full p-2"
            />
            <Input
              ref={linkRef}
              placeholder="Enter the link"
              className="bg-gray-800 text-white border-gray-600 w-full p-2"
            />

            {/* Type Selector */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded"
              >
                {CONTENT_TYPE_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={addContent}
              variant="primary"
              text={loading ? "Loading..." : "Submit"}
              disabled={loading}
       
            />
          </div>
        </div>
      </div>
    </>
  );
}
