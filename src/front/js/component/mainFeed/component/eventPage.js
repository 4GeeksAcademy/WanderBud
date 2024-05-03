import React, { useContext, useState, useEffect } from "react";
import { AspectRatio, Card, CardContent, Typography, ButtonGroup, Avatar, AvatarGroup, Box, Button, FormControl, FormLabel, Textarea, IconButton, Stack } from "@mui/joy";
import Collapse from "@mui/material/Collapse";
import { Context } from "../../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Col } from "react-bootstrap";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapContainer from "../../Events/mapContainer";
import { createClient } from 'pexels';

export default function EventPage() {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [isExpanded, setIsExpanded] = useState(false)
  const [text, setText] = useState("")
  const [eventData, setEventData] = useState({})
  const [ownerData, setOwnerData] = useState({})
  const [eventOwnerID, setEventOwnerID] = useState("")
  const [eventStatus, setEventStatus] = useState("")
  const { event_id } = useParams();
  const [user_id, setUser_id] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const client = createClient(process.env.PEXELS_API_KEY);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    actions.getAppliedEvents();
    actions.getOneEvent(event_id).then((data) => {
      setEventData(data)
      setOwnerData(data.owner)
      setEventOwnerID(data.owner.user_id)
      setUser_id(store.userAccount.id)
      getPhoto(data).then((photo) => setPhoto(photo)).catch((error) => console.error(error));
      setLoaded(true);
    })
  }, [])

  useEffect(() => {
    handleEventStatus();
    setLoaded(true);
  }, [store.appliedPublicEvents])

  const handleEventStatus = () => {
    if (store.appliedPublicEvents !== null && store.appliedPublicEvents.length > 0) {
      for (const event of store.appliedPublicEvents) {
        if (event_id == event.id) {
          setEventStatus("Applied");
          break;
        }
      }
    } else {
      setEventStatus("");
    }
  };
  const getPhoto = async (data) => {
    try {
      const query = data.event_type_name || data.title || "Event Name";
      const response = await client.photos.search({ query, per_page: 1 });
      if (response.photos.length > 0) {
        console.log(response.photos[0]);
        return response.photos[0].src.landscape;
      } else {
        throw new Error("No photos found for the query.");
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
      return null; // Return null or a placeholder image URL
    }
  };

  const handleRequestAction = () => {
    if (eventStatus === "Applied") {
      actions.leaveEvent(event_id, text);
      setEventStatus(""); // Cambia el estado a vacío después de dejar el evento
    } else {
      actions.requestJoinEvent(event_id, text);
      setEventStatus("Applied"); // Cambia el estado a "Applied" después de solicitar unirse al evento
    }
  };
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };
  const handleDeleteEvent = (event_id) => {
    actions.deleteEvent(event_id);
    navigate("/feed")
  }


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
    (
      loaded && user_id !== 0 ?
        <div className="m-0 py-1 px-2 container-shadow">
          < Card variant="soft" sx={{ width: "100%", gap: 1 }}>
            <CardContent orientation="horizontal">
              <CardContent orientation="horizontal">
                <Avatar
                  alt="User"
                  src={ownerData.profile_image}
                  sx={{ width: 80, height: 80, aspectRatio: "1/1", visibility: "hidden" }}
                />
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{
                    p: 0,
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
                    onClick={() => { navigate(`/profile/${ownerData.user_id}`) }}
                  >
                    <Avatar
                      alt="User"
                      src={ownerData.profile_image}
                      sx={{ width: 80, height: 80, aspectRatio: "1/1" }}
                    />
                    <Collapse in={isExpanded} orientation="horizontal">
                      <div>
                        <Typography
                          level="title-md"
                          sx={{ ml: 0.5, pl: 1, pr: 2, color: "white" }}
                          noWrap
                        >
                          {ownerData.name + " " + ownerData.last_name}
                        </Typography>
                      </div>
                    </Collapse>
                  </IconButton>
                </Stack>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "1rem",
                  width: "100%",
                  mt: 0.8
                }}>
                  <Typography level="h4">{eventData.name}</Typography>
                  <Typography level="body-sm" sx={{ mt: 0, fontWeight: "body-xs" }}>
                    {formatDateRange(eventData.start_date, eventData.end_date)}
                  </Typography>
                  <Typography level="body-xs" sx={{ mt: 0, fontWeight: "body-xs" }}>
                    {eventData.location_name}
                  </Typography>
                </Box>
              </CardContent>
              <AvatarGroup sx={{ "--Avatar-ringSize": 0 }}>
                {eventData.members?.map((attendee, index) => (
                  index < 3 ? <Avatar key={index} alt={attendee.name} src={attendee.profile_image} sx={{ border: "#189ab4 solid 2px" }} /> :
                    (index === 3 ? <Avatar key={index} sx={{ border: "#189ab4 solid 2px" }}>+{eventData.members.length - 3}</Avatar> : null)
                ))}
              </AvatarGroup>
            </CardContent>
            <AspectRatio ratio="21/9" sx={{
              width: "100%", overflow: "hidden"
            }}>
              <img
                alt=""
                src={photo || "https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"}
              />
            </AspectRatio>
            <CardContent>
              <Typography level="body-md" fontWeight="md" sx={{ marginBottom: 0 }}>
                {eventData.description}
              </Typography>
              <Typography level="body-xs">
                {eventData.location}
              </Typography>
            </CardContent>
            <AspectRatio ratio="21/5">
              <MapContainer selectedLocation={eventData.coordinates} address={eventData.location} />
            </AspectRatio>
            <CardContent orientation="horizontal" sx={{ width: "100%" }}>
              <div>
                <Typography level="body-xs">Budget:</Typography>
                <Typography fontSize="lg" fontWeight="lg">
                  ${eventData.budget_per_person}
                </Typography>
              </div>
              <ButtonGroup
                color="neutral"
                buttonFlex={1}
                disabled={false}
                orientation="horizontal"
                size="md"
                spacing={1}
                variant="solid"
                sx={{ ml: "auto", width: "40%", display: ownerData.user_id === user_id ? "flex" : "none" }}
              >
                <Button color="primary" sx={{ p: "auto" }} onClick={() => navigate(`/update-event/${event_id}`)}>Edit <EditIcon sx={{ ml: 0.5 }} /></Button>
                <Button color="danger" sx={{ p: "auto" }} onClick={() => { handleDeleteEvent(event_id) }}>Delete <DeleteIcon /></Button>
              </ButtonGroup>
            </CardContent>
          </Card >

          <Card sx={{ mt: 1, width: "100%", display: ownerData.user_id === user_id ? "none" : "flex" }} variant="soft">
            <FormControl>
              <FormLabel>Your request message</FormLabel>
              <Box sx={{ display: "flex" }}>
                <Textarea
                  placeholder="Type something here…"
                  variant="outlined"
                  minRows={3}
                  disabled={eventStatus === "Applied" ? true : false}
                  onChange={(e) => setText(e.target.value)}
                  sx={{
                    width: "100%",
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                />
                <Button
                  sx={{
                    ml: "auto",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  color={eventStatus === "Applied" ? "danger" : "primary"}
                  onClick={handleRequestAction}
                >
                  {eventStatus === "Applied" ? "Leave" : "Join"}
                </Button>
              </Box>

            </FormControl>
          </Card>
        </div >
        : <Col className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>)
  );
}