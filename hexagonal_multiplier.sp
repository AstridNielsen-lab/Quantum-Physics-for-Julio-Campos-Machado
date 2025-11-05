* Hexagonal Greinacher Voltage Multiplier
* Based on Heinrich Greinacher design
* Input: 5V AC, 20A capability
* Output: 17kV DC
* Configuration: Hexagonal mesh

* AC Source (5V, 60Hz)
Vin 1 0 SIN(0 5 60 0 0)
Rin 1 2 0.25 ; Resistor to limit current to 20A capability

* Hexagonal Configuration (6 sides with multiplier stages on each side)
* Each side of the hexagon contains multiple stages of the multiplier

* Side 1 (First branch of hexagon)
D11 2 3 DHVDIODE
C11 3 0 1uF
D12 0 3 DHVDIODE
C12 4 3 1uF
D13 4 5 DHVDIODE
C13 5 3 1uF
D14 3 5 DHVDIODE
C14 6 5 1uF
D15 6 7 DHVDIODE
C15 7 5 1uF
D16 5 7 DHVDIODE
C16 8 7 1uF

* Side 2 (Second branch of hexagon)
D21 2 9 DHVDIODE
C21 9 0 1uF
D22 0 9 DHVDIODE
C22 10 9 1uF
D23 10 11 DHVDIODE
C23 11 9 1uF
D24 9 11 DHVDIODE
C24 12 11 1uF
D25 12 13 DHVDIODE
C25 13 11 1uF
D26 11 13 DHVDIODE
C26 14 13 1uF

* Side 3 (Third branch of hexagon)
D31 2 15 DHVDIODE
C31 15 0 1uF
D32 0 15 DHVDIODE
C32 16 15 1uF
D33 16 17 DHVDIODE
C33 17 15 1uF
D34 15 17 DHVDIODE
C34 18 17 1uF
D35 18 19 DHVDIODE
C35 19 17 1uF
D36 17 19 DHVDIODE
C36 20 19 1uF

* Side 4 (Fourth branch of hexagon)
D41 2 21 DHVDIODE
C41 21 0 1uF
D42 0 21 DHVDIODE
C42 22 21 1uF
D43 22 23 DHVDIODE
C43 23 21 1uF
D44 21 23 DHVDIODE
C44 24 23 1uF
D45 24 25 DHVDIODE
C45 25 23 1uF
D46 23 25 DHVDIODE
C46 26 25 1uF

* Side 5 (Fifth branch of hexagon)
D51 2 27 DHVDIODE
C51 27 0 1uF
D52 0 27 DHVDIODE
C52 28 27 1uF
D53 28 29 DHVDIODE
C53 29 27 1uF
D54 27 29 DHVDIODE
C54 30 29 1uF
D55 30 31 DHVDIODE
C55 31 29 1uF
D56 29 31 DHVDIODE
C56 32 31 1uF

* Side 6 (Sixth branch of hexagon)
D61 2 33 DHVDIODE
C61 33 0 1uF
D62 0 33 DHVDIODE
C62 34 33 1uF
D63 34 35 DHVDIODE
C63 35 33 1uF
D64 33 35 DHVDIODE
C64 36 35 1uF
D65 36 37 DHVDIODE
C65 37 35 1uF
D66 35 37 DHVDIODE
C66 38 37 1uF

* Interconnections between branches (creating the hexagonal mesh)
* Connecting adjacent sides at strategic points
R12 8 14 1k
R23 14 20 1k
R34 20 26 1k
R45 26 32 1k
R56 32 38 1k
R61 38 8 1k

* Additional stages to reach 17kV
* Central multiplication stages
D71 38 39 DHVDIODE
C71 39 0 1uF
D72 0 39 DHVDIODE
C72 40 39 1uF
D73 40 41 DHVDIODE
C73 41 39 1uF
D74 39 41 DHVDIODE
C74 42 41 1uF
D75 42 43 DHVDIODE
C75 43 41 1uF
D76 41 43 DHVDIODE
C76 44 43 1uF

* Final stage for output
DOUT 44 45 DHVDIODE
COUT 45 0 1uF
RLOAD 45 0 17MEG ; Load resistor (17M ohm for 1mA at 17kV)

* High Voltage Diode Model
.MODEL DHVDIODE D(Is=1e-12 Rs=1 Cjo=1p Vj=1 BV=20k)

* Analysis Commands
.TRAN 0.1m 100m ; Transient analysis
.OPTIONS ABSTOL=1e-9 RELTOL=1e-3 VNTOL=1e-6 ; Set simulation options
.PROBE ; Enable waveform viewing
.END

