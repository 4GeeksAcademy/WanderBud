import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AspectRatio, Button, Card, Box, CardContent, CardOverflow, IconButton, Typography, Avatar, Stack } from "@mui/joy";
import Collapse from "@mui/material/Collapse";
import { BookmarkAdd, Image } from "@mui/icons-material";
import { Context } from "../../store/appContext";

export default function EventCard({ event }) {
    const { store, actions } = useContext(Context);
    const userId = store.userAccount.id;
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false)
    const [isExpandedF, setIsExpandedF] = useState(false)

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

    return (
        <Card sx={{ width: "100%", minHeight: "100%", overflow: "hidden", my: 3 }} variant="soft">
            <CardOverflow variant="soft" sx={{ overflow: "hidden", pb: 1 }}>
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
                        src="https://www.soycorredor.es/uploads/s1/10/96/70/78/como-entrenar-un-maraton.jpeg"
                        sx={{
                            objectPosition: "50% 15%",
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
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => { navigate(`/profile/${event.owner.user_id}`) }}
                    >
                        <Avatar
                            alt="User"
                            src={event.owner.profile_image}
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
                        aria-label="bookmark Bahamas Islands"
                        variant="plain"
                        color="neutral"
                        size="sl"
                        sx={{
                            ml: 2,
                            mr: 1,
                            p: 0.5,
                            borderRadius: 50,
                            width: "fit-content",
                            display: userId !== event.owner.id ? "flex" : "none"
                        }}
                        onMouseEnter={handleMouseEnterF}
                        onMouseLeave={handleMouseLeaveF}
                        onClick={() => { {/* setFavorite*/ } }}
                    >
                        <Collapse in={isExpandedF} orientation="horizontal">
                            <Typography level="body-sm" sx={{ color: "black", pl: 1 }} noWrap>
                                Add to Favorites
                            </Typography>
                        </Collapse>
                        <BookmarkAdd sx={{ color: "black" }} />
                    </IconButton>
                </Stack>
                <Stack
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <div>
                        <Typography level="title-lg" sx={{ mt: 0.5 }}>
                            {event.name}
                        </Typography>
                        <Typography level="body-xs">{formatDateRange(event.start_date, event.end_date)}</Typography>
                        <Typography
                            level="body-sm"
                            sx={{ mt: 0.5, fontWeight: 500 }}
                            textColor="common.black"
                        >
                            {event.description}
                        </Typography>
                        <Typography level="body-xs">{event.location}</Typography>
                    </div>
                    <CardContent orientation="horizontal" sx={{ width: "100%" }}>
                        <div>
                            <Typography level="body-xs">Budget:</Typography>
                            <Typography fontSize="lg" fontWeight="lg">
                                ${event.budget_per_person}
                            </Typography>
                        </div>
                        <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label="Explore Bahamas Islands"
                            sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
                            onClick={() => { navigate(`/event/${event.id}`) }}
                        >
                            Explore
                        </Button>
                    </CardContent>
                </Stack>
            </CardOverflow>
        </Card>
    );
}
