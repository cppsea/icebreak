import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";
import { ENDPOINT } from "./constants";
import PropTypes from "prop-types";

const EventContext = createContext();
const EVENTID = "6e22eb57-fce2-4db7-9279-5ab6c3acfec7";

export function EventProvider({ eventID = EVENTID, children }) {
  const [event, setEvent] = useState([]);

  useEffect(() => {
    async function getEventData() {
      try {
        const token = await SecureStore.getValueFor("accessToken");

        const { data: eventResponse } = await axios.get(
          `${ENDPOINT}/events/${eventID}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        setEvent(eventResponse.data.event);
      } catch (err) {
        console.error(err);
      }
    }

    getEventData();
  }, []);

  //retrieve data on re-render
  const eventCtx = useMemo(() => event);

  return (
    <EventContext.Provider value={eventCtx}>{children}</EventContext.Provider>
  );
}

export function useEventContext() {
  const eventInfo = useContext(EventContext);
  if (!eventInfo) {
    throw new Error(
      "You are using guild context outside of EventProvider. Context undefined",
    );
  }
  return eventInfo;
}

EventProvider.propTypes = {
  eventID: PropTypes.string,
  children: PropTypes.node,
};
