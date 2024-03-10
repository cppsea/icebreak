const prisma = require("../prisma/prisma");

async function getAllEvents() {
  return prisma.event.findMany();
}

async function getEvents(limit, action, eventId) {
  let events;

  switch (action) {
    case "prev":
      events = await prisma.events.findMany({
        take: -1 * limit,
        skip: 1, // skip cursor (TODO: check if skip 1 is needed for previous page queries)
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    case "next":
      events = await prisma.events.findMany({
        take: limit,
        skip: 1, // skip cursor
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    // first request made for first page, no action in cursor present
    default:
      events = await prisma.events.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  return events;
}

async function getPages(limit) {
  const totalEvents = await prisma.events.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function createEvent(eventData, guildId) {
  const newEvent = await prisma.events.create({
    data: {
      guildId: guildId,
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      thumbnail: eventData.thumbnail,
    },
  });
  return newEvent;
}

async function getEvent(eventId) {
  return prisma.events.findUniqueOrThrow({
    where: {
      eventId: eventId,
    },
  });
}

async function deleteEvent(eventId) {
  const deletedEvent = await prisma.events.delete({
    where: {
      eventId: eventId,
    },
  });
  return deletedEvent;
}

async function updateEvent(eventId, eventData) {
  const updateEvent = await prisma.events.update({
    where: {
      eventId: eventId,
    },
    //If a given data was not updated, it will be undefined and prisma will ignore the update of that field
    data: {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      thumbnail: eventData.thumbnail,
    },
  });
  return updateEvent;
}

async function getEventAttendees(eventId) {
  const query = await prisma.users.findMany({
    where: {
      eventAttendees: {
        some: {
          eventId: eventId,
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });
  return query;
}

async function updateAttendeeStatus(eventId, userId, attendeeStatus) {
  const query = await prisma.eventAttendees.update({
    where: {
      userId_eventId: {
        userId: userId,
        eventId: eventId,
      },
    },
    data: {
      status: attendeeStatus,
    },
  });

  if (attendeeStatus === "CheckedIn") {
    await addCheckInPoints(eventId, userId);
  }

  return query;
}

async function addCheckInPoints(eventId, userId) {
  const event = await prisma.events.findUnique({
    where: {
      eventId: eventId,
    },
    select: {
      startDate: true,
      guildId: true, // Assuming you need the guild ID to find the guildMember
    },
  });

  if (!event) throw new Error("Event not found");

  const currentTime = new Date();
  const eventStartTime = event.startDate.getTime();
  const fiveMinutesInMilliseconds = 5 * 60 * 1000;
  const currentTimeInMilliseconds = currentTime.getTime();
  //Default points to add
  let pointsToAdd = 3;

  if (
    currentTimeInMilliseconds <= eventStartTime &&
    currentTimeInMilliseconds >= eventStartTime - fiveMinutesInMilliseconds
  ) {
    pointsToAdd = 5;
  } else if (
    currentTimeInMilliseconds > eventStartTime &&
    currentTimeInMilliseconds <= eventStartTime + fiveMinutesInMilliseconds
  ) {
    pointsToAdd = 4;
  }

  await prisma.guildMembers.update({
    where: {
      userId_guildId: {
        userId: userId,
        guildId: event.guildId,
      },
    },
    data: {
      points: {
        increment: pointsToAdd,
      },
    },
  });
}

module.exports = {
  getEvent,
  getEvents,
  getPages,
  getAllEvents,
  deleteEvent,
  updateEvent,
  createEvent,
  getEventAttendees,
  updateAttendeeStatus,
};
