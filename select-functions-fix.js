// Fixed select functions for ClientsPageClient.tsx

// Replace the existing handleSelectAll function with this:
const handleSelectAll = () => {
  if (selectAll) {
    // Unselect all clients on current page
    const currentPageClientIds = clients.map((client) => client.id);
    setSelectedClients(selectedClients.filter(id => !currentPageClientIds.includes(id)));
    setSelectAll(false);
  } else {
    // Select all clients on current page
    const currentPageClientIds = clients.map((client) => client.id);
    const newSelectedClients = [...new Set([...selectedClients, ...currentPageClientIds])];
    setSelectedClients(newSelectedClients);
    setSelectAll(true);
  }
};

// Replace the existing handleSelectClient function with this:
const handleSelectClient = (id: number) => {
  if (selectedClients.includes(id)) {
    setSelectedClients(selectedClients.filter((clientId) => clientId !== id));
  } else {
    setSelectedClients([...selectedClients, id]);
  }
};

// Add this useEffect after the existing useEffects to manage selectAll state:
useEffect(() => {
  if (clients.length > 0) {
    const currentPageClientIds = clients.map((client) => client.id);
    const allCurrentPageSelected = currentPageClientIds.every(id => selectedClients.includes(id));
    setSelectAll(allCurrentPageSelected);
  }
}, [selectedClients, clients]);

// The header checkbox should be:
<input 
  type="checkbox" 
  className="accent-rose-500" 
  checked={selectAll}
  onChange={handleSelectAll}
/>
