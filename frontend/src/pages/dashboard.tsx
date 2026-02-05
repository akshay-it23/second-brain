import { Button } from "../components/Button";
import { ShareIcon } from "../icons/share";
import { PlusIcon } from "../icons/PlusIcon";
import { Card } from "../components/Card";
import "../App.css";
import { Sidebar } from "../components/SidebarComponent";
import { useState, useEffect } from "react";
import { CreateContentModal } from "../components/CreateContentModel";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// (removed unused import 'bak')
import { FaSpinner } from "react-icons/fa";
import { Logo } from "../icons/logo";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Dashboard() {
  type ContentItem = {
    _id?: string;
    type?: string | null;
    link?: string | null;
    title?: string | null;
  };

  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  // removed unused viewSide state

  const navigate = useNavigate();
  const { contents, refresh } = useContent();

  // ✅ NEW: platform filter state (null = no filter)
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);

  useEffect(() => {
    // refresh();
  }, [addContentModalOpen, refresh]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const url = `${BACKEND_URL}/api/v1/brain/${response.data.hash}`;

      const toastId = `share-${Date.now()}`;

      toast.success(
        <div className="relative flex flex-col bg-[#14053f] p-3 m-3 gap-2">
          <button
            onClick={() => toast.dismiss(toastId)}
            aria-label="Close share toast"
            className="absolute right-2 top-1 text-white hover:text-purple-300 text-lg font-bold px-2"
            style={{ background: 'transparent', border: 'none' }}
          >
            ×
          </button>

          <div className="font-bold">Share URL created</div>
          <a href={url} target="_blank" rel="noreferrer" className="text-sm break-words text-blue-500">{url}</a>
          <div>
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(url);
                  toast.info("Copied to clipboard", { autoClose: 1500 });
                } catch (e) {
                  console.error(e);
                }
              }}
              className="mt-1 px-3 py-1 bg-blue-700 rounded text-sm"
            >
              Copy
            </button>
          </div>
        </div>,
        {
          toastId,
          position: "top-right",
          autoClose: false,
          style: {
            background: '#14053fff',
            color: '#ffffff',
            border: '1px solid #ffffff',
          },
        }
      );
    } catch (error) {
      console.error("Error sharing content: ", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async (contentId: string) => {
    console.log(contentId);
    await axios.delete(`${BACKEND_URL}/api/v1/content/${contentId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    refresh();
  };

  return (
    <div>
      {/* ✅ Pass filter handler to Sidebar */}
      <Sidebar onFilter={setFilterPlatform} />

      <div className="p-4 ml-72 min-h-screen bg-black text-white">
        <CreateContentModal
          open={addContentModalOpen}
          onClose={() => setAddContentModalOpen(false)}
        />

        <ToastContainer
          position="top-right"
          newestOnTop
          closeOnClick
          pauseOnHover
        />

        <div className="flex gap-4 justify-end mb-6">
          <Button
            onClick={handleShare}
            variant="primary"
            text={isSharing ? "Sharing..." : "Share Brain"}
            startIcon={isSharing ? <FaSpinner className="animate-spin" /> : <ShareIcon />}
            disabled={isSharing}
          />

          <Button
            onClick={() => setAddContentModalOpen(true)}
            variant="secondary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />

          <Button
            variant={"secondary"}
            size={"md"}
            text={"Logout"}
            icon={Logo}
            color={"white"}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {contents
            .filter((content: ContentItem) => {
              if (!filterPlatform) return true; // No filter = show all

              // normalize platform string
              const wanted = filterPlatform.trim().toLowerCase();

              // if content.type exists, compare
              if (content?.type) {
                return content.type.trim().toLowerCase() === wanted;
              }

              // fallback: try to infer platform from the link
              const link = content?.link || "";
              if (!link) return false;
              const l = link.toLowerCase();
              if (wanted === "twitter" && (l.includes("twitter.com") || l.includes("x.com"))) return true;
              if (wanted === "youtube" && (l.includes("youtube.com") || l.includes("youtu.be"))) return true;
              if (wanted === "instagram" && l.includes("instagram.com")) return true;
              if (wanted === "spotify" && l.includes("spotify.com")) return true;
              if (wanted === "linkedin" && l.includes("linkedin.com")) return true;

              return false;
            })
            .map(({ _id, type, link, title }: ContentItem) => (
              <Card
                key={_id}
                _id={_id}
                type={type ?? "unknown"}
                link={link ?? ""}
                title={title ?? "Untitled"}
                onDelete={_id ? () => handleDelete(_id) : undefined}
              />
            ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
