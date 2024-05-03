import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AspectRatio, Button, Card, Box, CardContent, CardOverflow, IconButton, Typography, Avatar, Stack } from "@mui/joy";
import Collapse from "@mui/material/Collapse";
import { BookmarkAdd, Image } from "@mui/icons-material";
import { createClient } from 'pexels';
import { Context } from "../../store/appContext";

export default function EventCard({ event, handleClick }) {
    const { store, actions } = useContext(Context);
    const userId = store.userAccount.id;
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false)
    const [isExpandedF, setIsExpandedF] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const client = createClient(process.env.PEXELS_API_KEY);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        if (store.favorites !== null) {
            setIsFavorite(store.favorites.some(favorite => favorite.id === event.id));
        } else {
            actions.getFavorites(); // Asegúrate de que esta acción esté definida y traiga los eventos favoritos del usuario.
            // O simplemente dejar que isFavorite se mantenga en su estado actual (probablemente false).
            console.log("Favorites is null");
        }

    }, [store.favorites, event.id]);

    useEffect(() => {
        new Promise((resolve, reject) => {
            getPhoto().then((photo) => {
                setPhoto(photo);
                resolve();
            });
        }
        );

    }, [event.event_type_name]);


    const getPhoto = async () => {
        try {
            const query = event.event_type_name || event.title || "Event Name";
            const response = await client.photos.search({ query, per_page: 1 });
            if (response.photos.length > 0) {
                console.log(response.photos[0]);
                return response.photos[0].src.landscape;
            } else {
                console.log("No photos found for query:", query);
                return null; // Return null or a placeholder image URL

            }
        } catch (error) {
            console.error("Error fetching photo:", error);
            return null; // Return null or a placeholder image URL
        }
    };

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };
    const handleMouseEnterF = () => {
        setIsExpandedF(true);
    };

    const handleMouseLeaveF = () => {
        setIsExpandedF(false);
    };

    function formatDateRange(startDate, endDate) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startMonth = months[start.getMonth()];
        const startDay = start.getDate();
        const startHour = start.getHours();
        const startMinute = start.getMinutes();

        const endMonth = months[end.getMonth()];
        const endDay = end.getDate();
        const endHour = end.getHours();
        const endMinute = end.getMinutes();

        const startFormatted = `${startMonth} ${startDay < 10 ? '0' : ''}${startDay} ${startHour < 10 ? '0' : ''}${startHour}:${startMinute < 10 ? '0' : ''}${startMinute}`;
        const endFormatted = `${endMonth} ${endDay < 10 ? '0' : ''}${endDay} ${endHour < 10 ? '0' : ''}${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}`;

        return `${startFormatted} to ${endFormatted}, ${end.getFullYear()}`;
    }

    const handleFavorite = () => {
        if (isFavorite) {
            actions.removeFavoriteEvent(event.id);
            setIsFavorite(false);
        }
        else {
            actions.addFavoriteEvent(event.id);
            setIsFavorite(true);
        }

    }


    return (
        <Card sx={{ width: "100%", minHeight: "100%", overflow: "hidden", my: 3 }} variant="soft" className="container-card container-shadow">
            <CardOverflow sx={{ overflow: "hidden", pb: 1 }}>
                <AspectRatio
                    minHeight="20%"
                    maxHeight="20%"
                    objectFit="cover"
                    sx={{
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0",
                    }}
                >
                    <Box
                        component="img"
                        src={photo || "https://via.placeholder.com/500"}
                        sx={{
                            objectPosition: "50% 50%",
                            borderRadius: 0,
                            backgroundColor: "transparent"
                        }}
                    />
                </AspectRatio>
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    sx={{
                        p: 1,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        width: "100%",
                        mt: 0.5,
                    }}
                >
                    <IconButton
                        aria-label="bookmark Bahamas Islands"
                        variant="soft"
                        color="neutral"
                        size="sx"
                        sx={{
                            ml: 2,
                            mr: 1,
                            my: 0.5,
                            p: 0.5,
                            borderRadius: 50,
                            width: "fit-content",
                            backgroundColor: "#189ab4",
                            "&:hover": {
                                backgroundColor: "#189ab4",
                                boxShadow: "0 0 5px 0.2rem rgba(24,154,180,0.5)",
                            }
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => { navigate(`/profile/${event.owner.user_id}`) }}
                    >
                        <Avatar
                            alt="User"
                            src={event.owner?.profile_image || "https://via.placeholder.com/500"}
                            sx={{ width: 80, height: 80, aspectRatio: "1/1" }}
                        />
                        <Collapse in={isExpanded} orientation="horizontal">
                            <div>
                                <Typography
                                    level="title-lg"
                                    sx={{ ml: 0.5, pl: 1, pr: 2, color: "black" }}
                                    noWrap
                                >
                                    {event.owner.name + " " + event.owner.last_name}
                                </Typography>
                            </div>
                        </Collapse>
                    </IconButton>
                    <IconButton
                        aria-label="bookmark"
                        variant="soft"
                        color={isFavorite ? "error.dark" : "neutral"}
                        size="sl"
                        disabled={event.placeholder === "Create" || event.placeholder === "Edit"}
                        sx={{
                            ml: 2,
                            mr: 1,
                            p: 0.5,
                            borderRadius: 50,
                            width: "fit-content",
                            display: userId !== event.owner.user_id ? "flex" : "none",
                            color: isFavorite ? "#f3f6f6" : "black",
                            backgroundColor: isFavorite ? "#992d22" : "",
                            "&:hover": {
                                backgroundColor: isFavorite ? "#992d22" : "",
                                color: isFavorite ? "#f3f6f6" : "black",
                                boxShadow: isFavorite ? "0 0 5px 0.2rem rgba(153,45,34,0.5)" : "0 0 5px 0.2rem rgba(0,0,0,0.5)"
                            }
                        }}
                        onMouseEnter={handleMouseEnterF}
                        onMouseLeave={handleMouseLeaveF}
                        onClick={() => { handleFavorite() }}
                    >
                        <Collapse in={isExpandedF} orientation="horizontal">
                            <Typography level="body-sm" sx={{ pl: 1, color: isFavorite ? "#f3f6f6" : "black" }} noWrap>
                                {isFavorite ? "Remove favorites" : "Add to favorites"}
                            </Typography>
                        </Collapse>
                        <BookmarkAdd />
                    </IconButton>
                </Stack>
                <Stack
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <div>
                        <Typography level="title-lg" sx={{ mt: 0.5 }}>
                            {event.name || event.title || "Event Name"}
                        </Typography>
                        <Typography level="body-xs">{formatDateRange(event.start_date || event.startDate, event.end_date || event.endDate)}</Typography>
                        <Typography
                            level="body-sm"
                            sx={{ mt: 0.5, fontWeight: 500 }}
                            textColor="common.black"
                        >
                            {event.description || event.description || "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet"}
                        </Typography>
                        <Typography level="body-xs">{event.location_name || event.place_name || "New York, USA"}</Typography>
                    </div>
                    <CardContent orientation="horizontal" sx={{ width: "100%" }}>
                        <div>
                            <Typography level="body-xs">Budget:</Typography>
                            <Typography fontSize="lg" fontWeight="lg">
                                ${event.budget_per_person || event.budget || "10"}
                            </Typography>
                        </div>
                        <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label="Explore Bahamas Islands"
                            sx={{
                                ml: "auto", alignSelf: "center",
                                fontWeight: 600,
                                backgroundColor: event.placeholder === "Create" ? "#800080" : (event.placeholder === "Edit" ? "#189ab4" : "#189ab4"),
                                color: "#f3f6f6",
                                "&:hover": {
                                    backgroundColor: event.placeholder === "Create" ? "#6a006a" : (event.placeholder === "Edit" ? "#106b7d" : "#05445e"),
                                }
                            }}
                            onClick={() => { event.placeholder === "Create" ? handleClick() : (event.placeholder === "Edit" ? handleClick() : navigate(`/event/${event.id}`)) }}
                        >
                            {event.placeholder === "Create" ? "Post" : (event.placeholder === "Edit" ? "Edit" : "Explore")}
                        </Button>
                    </CardContent>
                </Stack>
            </CardOverflow>
        </Card>
    );
}
