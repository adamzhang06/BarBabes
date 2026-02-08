// Shared contact data for ContextList and GroupMapScreen
// BAC color logic: 0.00 = bright blue, green (0.01-0.05), yellow (0.06-0.12), orange (0.13-0.19), red (0.20+)
function bacToColor(bac) {
  if (bac === 0) return 'rgb(0,180,255)'; // bright blue
  if (bac <= 0.05) return 'rgb(115,255,136)'; // green
  if (bac <= 0.12) return 'rgb(255,192,91)'; // yellow/orange
  if (bac <= 0.19) return 'rgb(255,140,0)'; // orange
  return 'rgb(234,23,20)'; // red
}

export const contactData = [
  { id: '1', name: 'Designated Driver', initials: 'DD', bac: 0.00, statusColor: bacToColor(0.00) },
  { id: '2', name: 'Primary Contact 1', initials: 'PC', statusColor: 'transparent' },
  { id: '3', name: 'Primary Contact 2', initials: 'PC', statusColor: 'transparent' },
  { id: '4', name: 'Martini Mandy', initials: 'MM', bac: 0.04, statusColor: bacToColor(0.04) },
  { id: '5', name: 'Cosmo Cassidy', initials: 'CC', bac: 0.11, statusColor: bacToColor(0.11) },
  { id: '6', name: 'Bubbly Bonnie', initials: 'BB', bac: 0.17, statusColor: bacToColor(0.17) },
  { id: '7', name: 'Sangria Samantha', initials: 'SS', bac: 0.27, statusColor: bacToColor(0.27) },
];
