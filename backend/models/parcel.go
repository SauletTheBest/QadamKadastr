package models

// Parcel represents a cadastral land plot with bilingual information
type Parcel struct {
	ID              int         `json:"id"`
	CadastralNumber string      `json:"cadastralNumber"`
	AddressKZ       string      `json:"addressKz"`
	AddressRU       string      `json:"addressRu"`
	Area            string      `json:"area"`
	PurposeKZ       string      `json:"purposeKz"`
	PurposeRU       string      `json:"purposeRu"`
	StatusKZ        string      `json:"statusKz"`
	StatusRU        string      `json:"statusRu"`
	Coordinates     [][]float64 `json:"coordinates"`
}