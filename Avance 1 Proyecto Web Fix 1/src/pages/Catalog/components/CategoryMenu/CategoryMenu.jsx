import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { categoryTree } from '../../data/categories';

function CategoryBranch({ nodes, depth, selectedId, onSelect }) {
  const [openIds, setOpenIds] = useState({});

  return nodes.map((node) => {
    const hasChildren = Boolean(node.children?.length);
    const open = Boolean(openIds[node.id]);

    return (
      <Box key={node.id}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: depth * 2 }}>
          <ListItemButton selected={selectedId === node.id} onClick={() => onSelect(node.id)}>
            <ListItemText primary={node.label} />
          </ListItemButton>
          {hasChildren ? (
            <IconButton
              aria-label={open ? `Contraer ${node.label}` : `Expandir ${node.label}`}
              onClick={() => setOpenIds((current) => ({ ...current, [node.id]: !current[node.id] }))}
            >
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : null}
        </Box>
        {hasChildren ? (
          <Collapse in={open} unmountOnExit>
            <CategoryBranch
              nodes={node.children}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </Collapse>
        ) : null}
      </Box>
    );
  });
}

export default function CategoryMenu({ open, selectedId, onClose, onSelect }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 340, pt: 2 }} role="presentation">
        <Typography variant="h6" sx={{ px: 2, mb: 1 }}>
          Categorías
        </Typography>
        <List>
          <ListItemButton selected={selectedId == null} onClick={() => onSelect(null)}>
            <ListItemText primary="Todas Las Categorías" />
          </ListItemButton>
          <CategoryBranch nodes={categoryTree} depth={0} selectedId={selectedId} onSelect={onSelect} />
        </List>
      </Box>
    </Drawer>
  );
}
