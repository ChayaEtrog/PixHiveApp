import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../appStore";
import { UserContext } from "../user/UserReducer";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchUnassignedTags, addTag, addTagToFile } from "../tags/tagSlice";
import { Box, Button, List, ListItem, ListItemButton, ListItemText, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Tag } from "../../types/Tag";

const AddTag = ({ fileId, closeForm }: { closeForm: Function; fileId: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useContext(UserContext);
    const tagInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(fetchUnassignedTags(fileId));
    }, [dispatch, fileId]);

    const { tags } = useSelector((store: StoreType) => store.tag);
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

    const handleAddTag = async () => {
        const newTagName = tagInputRef.current?.value.trim();
        if (newTagName) {
            await dispatch(addTag(newTagName));
            dispatch(fetchUnassignedTags(fileId)); // רענון הרשימה לאחר ההוספה
            if (tagInputRef.current) tagInputRef.current.value = ""; // ניקוי השדה
        }
    };

    const handleAddTagToFile = async () => {
        if (selectedTagId) {
            await dispatch(addTagToFile({ fileId, tagId: selectedTagId }));
            closeForm();
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(95, 94, 94, 0.48)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "350px",
                    maxHeight: "60vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    clipPath: "inset(0 round 8px)"
                }}
            >
                <List>
                    {tags.length === 0 ? (
                        <ListItem>No tags found</ListItem>
                    ) : (
                        tags.map((tag: Tag) => (
                            <ListItem key={tag.id} disablePadding>
                                <ListItemButton selected={selectedTagId === tag.id} onClick={() => setSelectedTagId(tag.id)}>
                                    <ListItemText primary={tag.tagName} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
                <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                    <TextField inputRef={tagInputRef} label="New Tag" variant="outlined" size="small" fullWidth />
                    <IconButton onClick={handleAddTag} color="primary">
                        <AddIcon />
                    </IconButton>
                </Box>
                <Button onClick={handleAddTagToFile} disabled={!selectedTagId}>Add</Button>
                <Button onClick={() => closeForm(false)}>Cancel</Button>
            </Box>
        </Box>
    );
};

export default AddTag;
