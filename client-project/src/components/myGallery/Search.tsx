import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Card, CardContent, InputAdornment, IconButton, Menu, DialogTitle, DialogContent, Dialog, DialogActions, Popover } from '@mui/material';
import { AppDispatch, StoreType } from '../appStore';
import { fetchTags } from '../tags/tagSlice';
import { getFilesByDateAndUser, getFilesByTagAndUser, searchFiles } from '../images/imageSlice';
import { useParams } from 'react-router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { gradientBorderButton } from '../../styles/buttonsStyle';
import search from '../../../public/Icons/search.png'
import { resetAlbums, searchAlbumsByDate, searchAlbumsByName } from '../albums/albumSlice';
const Search = ({ userId }: { userId: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { tags } = useSelector((store: StoreType) => store.tag);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { albumId } = useParams();
    const [anchorTagEl, setAnchorTagEl] = useState<null | HTMLElement>(null);
    const [anchorDateEl, setAnchorDateEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleSearchByName = () => {
        setSearchTerm('');
        dispatch(searchFiles({ parentId: albumId ? Number(albumId) : -1, name: searchTerm, userId: userId }));
        dispatch(searchAlbumsByName({ parentId: albumId ? Number(albumId) : -1, name: searchTerm, userId: userId }))
    };

    const handleSearchByTag = () => {
        if (selectedTag) {
            setSelectedTag('')
            dispatch(resetAlbums())
            dispatch(getFilesByTagAndUser({ userId, tagName: selectedTag, parentAlbumId: albumId ? Number(albumId) : undefined }));
        }
    };

    const handleSearchByDate = () => {
        if (startDate && endDate) {
            setEndDate('')
            setStartDate('')
            dispatch(getFilesByDateAndUser({ userId, startDate: new Date(startDate), endDate: new Date(endDate), parentAlbumId: albumId ? Number(albumId) : undefined }));
            dispatch(searchAlbumsByDate({ userId, startDate: new Date(startDate), endDate: new Date(endDate), parentAlbumId: albumId ? Number(albumId) : undefined }))
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
            {/* Search by Name */}
            <TextField
                variant="outlined"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    minWidth: 500,
                    '& .MuiOutlinedInput-root': {
                        height: 47,
                        border: '2px solid',
                        borderImageSlice: 1,
                        borderImageSource: 'linear-gradient(to right, #47dcd1, #dc8dec)',
                        paddingRight: '10px',
                        backgroundColor: 'white'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none', // כדי לא לקבל מסגרת כפולה
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={handleSearchByName}>
                                <img src={search} alt="" style={{ width: '30px', height: '30px' }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Tag Search Button */}
            <Button
                onClick={(e) => setAnchorTagEl(e.currentTarget)}
                sx={gradientBorderButton}
                style={{ height: 45, width: '180px', padding: '0', textTransform: 'none', fontSize: '16px', }}
            >
                Search by Tag
                <KeyboardArrowDownIcon sx={{ marginLeft: ' 3px' }} />
            </Button>

            {/* Date Search Button */}
            <Button
                onClick={(e) => setAnchorDateEl(e.currentTarget)}
                sx={gradientBorderButton}
                style={{ height: 45, width: '180px', padding: '0', textTransform: 'none', fontSize: '16px', }}
            >
                Search by Date
                <KeyboardArrowDownIcon sx={{ marginLeft: ' 3px' }} />
            </Button>

            {/* Tag Popover */}
            <Popover
                open={Boolean(anchorTagEl)}
                anchorEl={anchorTagEl}
                onClose={() => setAnchorTagEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2, minWidth: 250 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Tag</InputLabel>
                        <Select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            label="Select Tag"
                        >
                            {tags.map(tag => (
                                <MenuItem key={tag.id} value={tag.tagName}>{tag.tagName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        onClick={handleSearchByTag}
                        disabled={!selectedTag}
                        sx={gradientBorderButton}
                        style={{ height: 45, minWidth: '50%', width: '73%', padding: '0', textTransform: 'none', fontSize: '16px', marginTop: '15px' }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={handleSearchByTag}
                        disabled={!selectedTag}
                        style={{ height: 45, width: 'max-content', padding: '0', textTransform: 'none', fontSize: '16px', marginTop: '15px' }}
                    >
                        <img src={search} alt="" style={{ width: '38px', height: '38px' }} />
                    </Button>
                </Box>
            </Popover>

            {/* Date Popover */}
            <Popover
                open={Boolean(anchorDateEl)}
                anchorEl={anchorDateEl}
                onClose={() => setAnchorDateEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2, minWidth: 250 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        onClick={handleSearchByDate}
                        disabled={!startDate || !endDate}
                        sx={gradientBorderButton}
                        style={{ height: 45, minWidth: '50%', width: '85%', padding: '0', textTransform: 'none', fontSize: '16px', marginTop: '15px' }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={handleSearchByDate}
                        disabled={!selectedTag}
                        style={{ height: 45, width: 'max-content', padding: '0', textTransform: 'none', fontSize: '16px', marginTop: '15px' }}
                    >
                        <img src={search} alt="" style={{ width: '38px', height: '38px' }} />
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
};

export default Search;
