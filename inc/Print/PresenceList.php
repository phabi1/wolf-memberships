<?php

namespace Wolf\Memberships\Print;

use Fpdf\Fpdf;

class PresenceList
{
    protected $title = 'Presence List';

    protected $headers = [];

    private $period;

    private $lessons = [];

    private $members = [];

    public function __construct()
    {
        $this->headers = [
            [
                'data' => 'index',
                'label' => '',
                'width' => 5
            ],
            [
                'data' => 'lastname',
                'label' => 'Nom'
            ],
            [
                'data' => 'firstname',
                'label' => 'Prénom'
            ],
            [
                'data' => 'birthdate',
                'label' => 'Date de naissance',
                'width' => 30
            ],
            [
                'data' => 'phone',
                'label' => 'Téléphone'
            ],
            [
                'label' => 'Inscription'
            ],
            [
                'label' => 'Médical'
            ],
            [
                'label' => 'Autorisation parentale'
            ]
        ];
    }

    public function setTitle(string $title)
    {
        $this->title = $title;
        return $this;
    }

    public function setLessons(array $lessons)
    {
        $this->lessons = $lessons;
        return $this;
    }

    public function setMembers(array $members)
    {
        $this->members = $members;
        return $this;
    }

    public function setPeriod($period)
    {
        $this->period = $period;
        return $this;
    }

    public function render()
    {
        $pdf = new Fpdf();

        foreach ($this->lessons as $lesson) {

            if (count($this->members[$lesson->id] ?? []) === 0) {
                continue;
            }

            $pdf->AddPage('L', 'A4');

            $headers = $this->buildHeaders($lesson);

            $this->renderHeader($pdf, $lesson);

            $pdf->Ln(10);


            $this->renderMembers($pdf, $headers, $this->members[$lesson->id] ?? []);
        }

        return $pdf->Output('I', '', true);
    }


    private function buildHeaders($lesson)
    {
        $headers = $this->headers;

        // Count days into period
        $periodStart = $this->period->start_date;
        $periodEnd = $this->period->end_date;

        $day = $lesson->day;

        $days = [];
        $currentDate = $periodStart;
        while ($currentDate <= $periodEnd) {
            if (date('N', $currentDate) == $day) {
                $days[] = $currentDate;
            }
            $currentDate = strtotime('+1 day', $currentDate);
        }

        $delimiter = 'phone';
        $delimiterIndex = array_search($delimiter, array_column($headers, 'data'));

        $firstPart = array_slice($headers, 0, $delimiterIndex + 1);
        $lastPart = array_slice($headers, $delimiterIndex + 1);

        $dayHeaders = array_map(function ($date) {
            return [
                'label' => date('d/m', $date),
                'width' => 10
            ];
        }, $days);

        return array_merge($firstPart, $dayHeaders, $lastPart);

    }
    private function renderHeader(Fpdf $pdf, $lesson)
    {
        $y = $pdf->GetY();

        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, $this->decodeString($lesson->title), 0, 1, 'C');
        $pdf->Ln(1);

        $subTitle = '' . $this->getDay($lesson->day) . ' - ' . date('H:i', $lesson->lesson_start) . ' à ' . date('H:i', $lesson->lesson_end);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, $this->decodeString($subTitle), 0, 1, 'C');
        $pdf->Ln(1);

        $y = $pdf->GetY();

        $pdf->SetLineWidth(0.1);
        $pdf->SetFontSize(8);
        $pdf->Rect(10, $y, 30, 10);
        $pdf->Text(10, $y + 15, $this->decodeString('Presences'));
        $pdf->Rect(50, $y, 150, 10);
        $pdf->Text(50, $y + 15, $this->decodeString('Professor'));
        $pdf->SetLineWidth(0);

        $pdf->Ln(15);
    }

    private function renderMembers(Fpdf $pdf, $headers, $members)
    {
        foreach ($headers as $index => $header) {
            $pdf->Cell($header['width'] ?? 30, 10, $this->decodeString($header['label']), 1, 0, 'C');
        }
        $pdf->Ln();

        $rows = $this->transformMembersToRows($members, $headers);

        foreach ($rows as $row) {
            foreach ($row as $cell) {
                $pdf->Cell($cell['width'], 7, $cell['label'], 1, 0, 'C');
            }
            $pdf->Ln();
        }
    }

    private function transformMembersToRows(array $members, array $headers)
    {
        $index = 1;
        $rows = [];
        foreach ($members as $member) {
            $row = [];
            foreach ($headers as $header) {
                $cell = [
                    'width' => $header['width'] ?? 30,
                    'label' => ''
                ];
                if ($header['data'] ?? null) {
                    switch ($header['data']) {
                        case 'index':
                            $cell['label'] = $index;
                            break;
                        default:
                            $value = $member->{$header['data']} ?? '';
                            if (is_string($value)) {
                                $value = $this->decodeString($value);
                            }
                            if ($header['data'] === 'birthdate' && $value) {
                                $value = date('d-m-Y', $value);
                            }
                            $cell['label'] = $value;
                            break;
                    }
                }


                $row[] = $cell;
            }
            $rows[] = $row;
            $index++;
        }
        return $rows;
    }

    private function getDay($day)
    {
        $days = [
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
            7 => 'Dimanche'
        ];
        return $days[$day] ?? '';
    }

    private function decodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'UTF-8');
    }
}