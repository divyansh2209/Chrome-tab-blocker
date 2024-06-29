import React, { useEffect, useState } from "react";
import '../assests/tailwind.css'
import { createRoot } from "react-dom/client";


const Popup = () => {
    const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
    const [newWebsite, setNewWebsite] = useState<string>('');

    useEffect(() => {
        // Load blocked websites from chrome storage
        chrome.storage.local.get(['blocked'], (result) => {
            if (Array.isArray(result.blocked)) {
                setBlockedWebsites(result.blocked);
            }
        });
    }, []);

    const handleAddWebsite = (event: React.FormEvent) => {
        event.preventDefault();
        if (newWebsite.trim()) {
            const updatedBlockedWebsites = [...blockedWebsites, newWebsite.trim()];
            setBlockedWebsites(updatedBlockedWebsites);
            chrome.storage.local.set({ blocked: updatedBlockedWebsites });
            setNewWebsite('');
        }
    };

    const handleDeleteWebsite = (website: string) => {
        const updatedBlockedWebsites = blockedWebsites.filter((item) => item !== website);
        setBlockedWebsites(updatedBlockedWebsites);
        chrome.storage.local.set({ blocked: updatedBlockedWebsites });
    };

    return (
        <div className="App">
            <h1>Blocked Websites</h1>
            <form onSubmit={handleAddWebsite} className="flex justify-center py-5">
                <input
                    type="text"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    className="bg-slate-300s ring-black px-4 py-4"
                    placeholder="Enter website URL"
                />
                <button type="submit" className="py-4 px-3 bg-indigo-500 text-white m-2">
                    Submit
                </button>
            </form>
            <ul>
                {blockedWebsites.map((website) => (
                    <li key={website} className="flex justify-between items-center">
                        <span>{website}</span>
                        <button onClick={() => handleDeleteWebsite(website)} className="ml-2 text-red-500">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const appContainer = document.createElement('div')
document.body.appendChild(appContainer)
const root = createRoot(appContainer)
console.log(appContainer)
root.render(<Popup />);