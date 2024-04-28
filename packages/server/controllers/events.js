const prisma = require("../prisma/prisma");
var QRCode = require("qrcode");

async function getAllEvents() {
  return prisma.event.findMany();
}

async function getEvents(limit, action, eventId) {
  let events;

  switch (action) {
    case "prev":
      events = await prisma.event.findMany({
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
      events = await prisma.event.findMany({
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
      events = await prisma.event.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  return events;
}

async function getPublicUpcomingEvents(limit, eventId) {
  let events;

  if (eventId) {
    events = await prisma.event.findMany({
      take: limit,
      skip: 1,
      cursor: {
        eventId: eventId,
      },
      orderBy: {
        startDate: "asc",
      },
      where: {
        guilds: {
          isInviteOnly: false,
        },
        startDate: {
          gt: new Date(),
        },
      },
    });
  } else {
    events = await prisma.event.findMany({
      take: limit,
      skip: 1,
      orderBy: {
        startDate: "asc",
      },
      where: {
        guilds: {
          isInviteOnly: false,
        },
        startDate: {
          gt: new Date(),
        },
      },
    });
  }
  return events;
}

async function getPages(limit) {
  const totalEvents = await prisma.event.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function createEvent(eventData, guildId) {
  const newEvent = await prisma.event.create({
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
  return prisma.event.findUniqueOrThrow({
    where: {
      eventId: eventId,
    },
  });
}

async function deleteEvent(eventId) {
  const deletedEvent = await prisma.event.delete({
    where: {
      eventId: eventId,
    },
  });
  return deletedEvent;
}

async function updateEvent(eventId, eventData) {
  const updateEvent = await prisma.event.update({
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

async function getUpcomingEvents(currentDate, guildId) {
  const upcomingEvents = await prisma.event.findMany({
    where: {
      guildId: guildId,
      startDate: { gte: currentDate },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return upcomingEvents;
}

async function getArchivedEvents(currDate, pastDate, guildId) {
  const archivedEvents = await prisma.event.findMany({
    where: {
      guildId: guildId,
      AND: [{ startDate: { gte: pastDate } }, { endDate: { lte: currDate } }],
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return archivedEvents;
}

async function updateAttendeeStatus(eventId, userId, attendeeStatus) {
  const query = await prisma.eventAttendee.upsert({
    where: {
      eventId_userId: {
        userId: userId,
        eventId: eventId,
      },
    },
    create: {
      userId: userId,
      eventId: eventId,
      status: attendeeStatus,
    },
    update: {
      status: attendeeStatus,
    },
  });

  if (attendeeStatus === "CheckedIn") {
    await addCheckInPoints(eventId, userId);
  }

  return query;
}

async function addCheckInPoints(eventId, userId) {
  const event = await prisma.event.findUnique({
    where: {
      eventId: eventId,
    },
    select: {
      startDate: true,
      guildId: true,
    },
  });

  if (!event) throw new Error("Event not found");

  const currentTime = new Date();
  const eventStartTime = event.startDate.getTime();
  const fiveMinutesInMilliseconds = 5 * 60 * 1000;
  const currentTimeInMilliseconds = currentTime.getTime();
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
      guildId_userId: {
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

async function generateCheckInQRCode(eventId) {
  const text = `icebreak://qr-code-check-in?eventId=${eventId}`;
  return QRCode.toDataURL(text);
}

module.exports = {
  getEvent,
  getEvents,
  getPages,
  getAllEvents,
  deleteEvent,
  updateEvent,
  createEvent,
  getUpcomingEvents,
  getArchivedEvents,
  getEventAttendees,
  updateAttendeeStatus,
  getPublicUpcomingEvents,
  generateCheckInQRCode,
};
