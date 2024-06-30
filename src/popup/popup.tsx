import React, { useEffect, useState } from "react";
import '../assests/tailwind.css'
import { createRoot } from "react-dom/client";


const Popup = () => {
    const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
    const [newWebsite, setNewWebsite] = useState<string>('');
    const [enabled, setEnabled] = useState<boolean>(false);
    const [editingWebsite, setEditingWebsite] = useState<string | null>(null);
    const [editedWebsite, setEditedWebsite] = useState<string>('');

    useEffect(() => {
        // Load blocked websites and enabled status from chrome storage
        chrome.storage.local.get(['blocked', 'enabled'], (result) => {
            if (Array.isArray(result.blocked)) {
                setBlockedWebsites(result.blocked);
            }
            if (typeof result.enabled === 'boolean') {
                setEnabled(result.enabled);
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

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setEnabled(isChecked);
        chrome.storage.local.set({ enabled: isChecked });
    };

    const handleEditWebsite = (website: string) => {
        setEditingWebsite(website);
        setEditedWebsite(website);
    };

    const handleSaveEdit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingWebsite) {
            const updatedBlockedWebsites = blockedWebsites.map((website) =>
                website === editingWebsite ? editedWebsite.trim() : website
            );
            setBlockedWebsites(updatedBlockedWebsites);
            chrome.storage.local.set({ blocked: updatedBlockedWebsites });
            setEditingWebsite(null);
            setEditedWebsite('');
        }
    };

    const handleCancelEdit = () => {
        setEditingWebsite(null);
        setEditedWebsite('');
    };

    return (
        <div className="App">
            <div>
                <input
                    id="checkbox"
                    type="checkbox"
                    checked={enabled}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                />
                <label className="text-base font-semibold" htmlFor="checkbox">Enable</label>
                <form onSubmit={handleAddWebsite} className="flex justify-center py-2 border-b-2">
                    <input
                        type="text"
                        value={newWebsite}
                        onChange={(e) => setNewWebsite(e.target.value)}
                        className="bg-slate-300 px-2 py-1 text-sm"
                        placeholder="Enter website URL"
                    />
                    <button type="submit" className="py-2 px-3 bg-indigo-500 text-white m-2 text-sm">
                        Add
                    </button>
                </form>
                <div className="flex justify-center items-center">
                    <h1 className="text-base font-bold">Blocked Websites</h1>
                </div>
                <ul className="list-disc list-inside">
                    {blockedWebsites.map((website, index) => (
                        <li key={`${website}-${index}`} className="flex justify-between items-center">
                            {editingWebsite === website ? (
                                <form onSubmit={handleSaveEdit} className="flex items-center w-full">
                                    <input
                                        type="text"
                                        value={editedWebsite}
                                        onChange={(e) => setEditedWebsite(e.target.value)}
                                        className="bg-slate-300 px-2 py-1 text-sm w-full"
                                    />
                                    <button type="submit" className="ml-2 text-green-500">Save</button>
                                    <button type="button" onClick={handleCancelEdit} className="ml-2 text-red-500">Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <p className="text-base">{`-  ${website}`}</p>
                                    <div>
                                        <button onClick={() => handleEditWebsite(website)} className="ml-2 text-yellow-500">✏️</button>
                                        <button onClick={() => handleDeleteWebsite(website)} className="ml-2 text-red-500">⛔</button>
                                    </div>
                                </>
                            )}
                        </li>
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