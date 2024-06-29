import React, { useEffect, useState } from "react";
import '../assests/tailwind.css'
import { createRoot } from "react-dom/client";


const Popup = () => {
    const [websiteURL, setWebsiteURL] = useState<string>('');
    const [blockedSites, setBlockedSites] = useState<string[]>([]);

    useEffect(() => {
        // Ensure the chrome storage API is available
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(["blocked"], (local) => {
                const { blocked } = local as { blocked: string[] };
                if (Array.isArray(blocked)) {
                    setBlockedSites(blocked);
                }
            });
        }
    }, []);

    const handleSaveClick = (event: React.FormEvent) => {
        event.preventDefault();
        if (websiteURL.trim() !== '') {
            const newBlockedSites = [...blockedSites, websiteURL.trim()];
            setBlockedSites(newBlockedSites);
            if (chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set({ blocked: newBlockedSites });
            }
            setWebsiteURL('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSaveClick} className="flex justify-center py-5">
                <input
                    type="text"
                    name="name"
                    className="bg-slate-300 ring-black px-4 py-4"
                    placeholder="Enter website URL"
                    value={websiteURL}
                    onChange={(e) => setWebsiteURL(e.target.value)}
                />
                <button type="submit" className="py-4 px-3 bg-indigo-500 text-white m-2">
                    Submit
                </button>
            </form>
            <div>
                <h2>Blocked Websites</h2>
                <ul>
                    {blockedSites.map((site, index) => (
                        <li key={index}>{site}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const appContainer = document.createElement('div')
document.body.appendChild(appContainer)
const root = createRoot(appContainer)
console.log(appContainer)
root.render(<Popup />);