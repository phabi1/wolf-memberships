import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { Lesson } from "../../models/lesson";
import LessonService from "../../services/lesson";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function LessonListPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const days = useMemo(() => {
    const daysOfWeek = [
      { day: 1, title: "Monday" },
      { day: 2, title: "Tuesday" },
      { day: 3, title: "Wednesday" },
      { day: 4, title: "Thursday" },
      { day: 5, title: "Friday" },
      { day: 6, title: "Saturday" },
      { day: 7, title: "Sunday" },
    ];
    return daysOfWeek.map((day) => {
      const dayLessons = lessons.filter((lesson) => lesson.day === day.day);
      return {
        day: day.day,
        title: day.title,
        lessons: dayLessons,
      };
    });
  }, [lessons]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    LessonService.items(campaignId!).then((data) => {
      setLessons(data.items);
    });
  }, [campaignId]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Lessons
      </Typography>
      <div>
        {days.map((day) => (
          <Box key={day.day} sx={{ mb: 4 }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
              <Typography variant="h6" gutterBottom>
                {day.title}
              </Typography>
              <Button>
                Add Lesson
              </Button>
            </Box>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={'50%'}>Title</TableCell>
                      <TableCell width={'10%'}>Start Time</TableCell>
                      <TableCell width={'10%'}>End Time</TableCell>
                      <TableCell width={'10%'}>Age Range</TableCell>
                      <TableCell width={'10%'}>Max Participants</TableCell>
                      <TableCell width={'10%'}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {day.lessons.length > 0 ? (
                      day.lessons.map((lesson) => (
                        <TableRow
                          key={lesson.id}
                          hover
                          onClick={() =>
                            navigate(
                              `/campaigns/${campaignId}/lessons/${lesson.id}`,
                            )
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{lesson.title}</TableCell>
                          <TableCell>
                            {formatTime(lesson.lesson_start)}
                          </TableCell>
                          <TableCell>{formatTime(lesson.lesson_end)}</TableCell>
                          <TableCell>
                            {lesson.age_min && lesson.age_max
                              ? `${lesson.age_min} - ${lesson.age_max} years`
                              : "All Ages"}
                          </TableCell>
                          <TableCell>
                            {lesson.participant_max || "Unlimited"}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/campaigns/${campaignId}/lessons/${lesson.id}/edit`,
                                );
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No lessons available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        ))}
      </div>
      <Outlet />
    </>
  );
}
