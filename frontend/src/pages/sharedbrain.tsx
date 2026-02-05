import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Card } from "../components/Card";
import { Logo } from "../icons/logo";

export function SharedBrain() {
    const { shareLink } = useParams();
    const [content, setContent] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSharedBrain = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/v1/brain/${shareLink}`
                );
                setContent(response.data.content);
                setUsername(response.data.username);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching shared brain:", err);
                setError(err.response?.data?.message || "Failed to load shared brain");
                setLoading(false);
            }
        };

        if (shareLink) {
            fetchSharedBrain();
        }
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading shared brain...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Logo />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {username}'s Brain
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Shared collection • {content.length} item{content.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {content.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-2xl font-bold mb-2">No content yet</h2>
                        <p className="text-gray-400">
                            This brain doesn't have any content to share yet.
                        </p>
                    </div>
                ) : (
                    <div className="flex gap-4 flex-wrap">
                        {content.map((item: any) => (
                            <Card
                                key={item._id}
                                _id={item._id}
                                type={item.type || "unknown"}
                                link={item.link || ""}
                                title={item.title || "Untitled"}
                                onDelete={undefined}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
                    <p>Powered by Brainely • Second Brain for the Internet</p>
                </div>
            </div>
        </div>
    );
}

export default SharedBrain;
