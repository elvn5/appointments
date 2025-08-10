"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import ruLocale from "@fullcalendar/core/locales/ru";
import styles from "./styles.module.scss";
import { Avatar, Popover, Select, Typography } from "antd";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import { PopoverContent } from "@/components/PopoverContent";
import { useQueryState } from "@/hooks";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import appointments from "@/mocks/appointments.json";
import { useMemo } from "react";

dayjs.extend(customParseFormat);
dayjs.locale("ru");

const mappedDoctors = appointments.map((app) => ({
  value: app.doctor,
  label: (
    <div>
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
      <Typography.Text>
        {app.doctor}, {app.specialty}
      </Typography.Text>
    </div>
  ),
}));

export default function CalendarPage() {
  const [doctor, setDoctor] = useQueryState({
    key: "doctor",
    defaultValue: mappedDoctors[0].value,
  });

  const schedule = useMemo(() => {
    const currentSchedule = appointments.filter(
      (app) => app.doctor == doctor
    )[0].appointments;
    const mappedSchedule = currentSchedule.map((sch) => ({
      title: sch.patient,
      start: sch.timeStart,
      end: sch.timeEnd,
      backgroundColor: sch.status === "Не пришел" ? "red" : "green",
      phone: sch.phone,
      doctor: doctor,
      type: sch.type,
      status: sch.status,
      comment: sch.comment,
    }));
    return mappedSchedule;
  }, [doctor]);

  console.log(schedule);

  return (
    <div className="mx-auto bg-white min-h-screen">
      <div
        className={` bg-white rounded-xl shadow-lg p-6 ${styles.calendarContainer}`}
      >
        <Select
          style={{ width: "100%", minHeight: 50 }}
          value={doctor}
          onChange={(val) => {
            setDoctor(val);
          }}
          options={mappedDoctors}
        />
        <div className="bg-yellow-200 rounded-xs my-2">
          <Typography.Paragraph className="p-4">
            Текущая дата: {dayjs().format("ddd, D MMMM HH:mm")}
          </Typography.Paragraph>
        </div>
        <FullCalendar
          plugins={[timeGridPlugin]}
          locale={ruLocale}
          weekends={false}
          initialView="timeGridWeek"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          events={schedule}
          eventColor="#10b981"
          eventTextColor="#ffffff"
          height="auto"
          eventContent={(eventInfo) => {
            const formattedStart = dayjs(eventInfo.event.start).format(
              "ddd, D MMMM HH:mm"
            );
            const popoverContent = (
              <PopoverContent
                title={eventInfo.event.title}
                phone={eventInfo.event.extendedProps.phone}
                doctor={eventInfo.event.extendedProps.doctor}
                type={eventInfo.event.extendedProps.type}
                status={eventInfo.event.extendedProps.status}
                comment={eventInfo.event.extendedProps.comment}
              />
            );
            return (
              <Popover content={popoverContent} trigger="hover" placement="top">
                <div className={styles.eventContent}>
                  <p>
                    {dayjs(eventInfo.event.start).format("HH:mm")}-
                    {dayjs(eventInfo.event.end).format("HH:mm")}
                  </p>
                  <strong>{eventInfo.event.title}</strong>
                </div>
              </Popover>
            );
          }}
        />
      </div>
    </div>
  );
}
