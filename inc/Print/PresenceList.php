<?php

namespace Wolf\Memberships\Print;

use Fpdf\Fpdf;

class PresenceList
{
    protected $title = 'Presence List';

    protected $headers = [];

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
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
            ],
            [
                'label' => '',
                'width' => 7
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

    public function render()
    {
        $pdf = new Fpdf();

        foreach ($this->lessons as $lesson) {
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 16);
            $pdf->Cell(0, 10, $this->decodeString($lesson->title), 0, 1, 'C');
            $pdf->Ln(10);

            $this->renderHeader($pdf);

            $pdf->Ln(10);

            $this->renderMembers($pdf, $this->members[$lesson->id] ?? []);
        }

        return $pdf->Output('I', '', true);
    }

    private function renderHeader(Fpdf $pdf)
    {
        $pdf->SetLineWidth(0.1);
        $pdf->SetFontSize(8);
        $pdf->Rect(10, 20, 30, 10);
        $pdf->Text(10, 35, $this->decodeString('Presences'));
        $pdf->Rect(50, 20, 150, 10);
        $pdf->Text(50, 35, $this->decodeString('Professor'));
        $pdf->SetLineWidth(0);
    }

    private function renderMembers(Fpdf $pdf, $members)
    {
        foreach ($this->headers as $index => $header) {
            $pdf->Cell($header['width'] ?? 30, 10, $this->decodeString($header['label']), 1, 0, 'C');
        }
        $pdf->Ln();

        $rows = $this->transformMembersToRows($members, $this->headers);

        foreach ($rows as $row) {
            foreach ($row as $cell) {
                $pdf->Cell($cell['width'], 10, $cell['label'], 1, 0, 'C');
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

    private function decodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'UTF-8');
    }
}