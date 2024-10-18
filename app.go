package main

import (
	"context"
	"fmt"
	"time"
	"gorm.io/gorm"
	"gorm.io/driver/sqlite"
)

// CPUCode model
type CPUCode struct {
	ID        uint      `gorm:"primaryKey"`
	Code      string    `gorm:"uniqueIndex"`
	Store     string
	Status    string    `gorm:"default:unused"` // used, unused, err
	Remark    string
	Err       string
	imgUrl    string
	CreatedAt time.Time
	UpdatedAt time.Time
	UsedAt    time.Time
}

// BoardCode model
type BoardCode struct {
	ID        uint      `gorm:"primaryKey"`
	Code      string    `gorm:"uniqueIndex"`
	Brand     string
	Status    string    `gorm:"default:unused"` // used, unused, err
	Remark    string
	Err       string
	imgUrl    string
	CreatedAt time.Time
	UpdatedAt time.Time
	UsedAt    time.Time
}

// Pagination struct for list responses
type Pagination struct {
	Total int64 `json:"total"`
	Page  int   `json:"page"`
	Size  int   `json:"size"`
}

// ListResponse struct for paginated list responses
type ListResponse struct {
	Pagination Pagination `json:"pagination"`
	Data       interface{} `json:"data"`
}

// CPUCodeFilter struct for filtering CPUCodes
type CPUCodeFilter struct {
	Code          string     `json:"code"`
	Store         string     `json:"store"`
	Status        string     `json:"status"`
	Remark        string     `json:"remark"`
	CreatedAtFrom *time.Time `json:"created_at_from"`
	CreatedAtTo   *time.Time `json:"created_at_to"`
	UpdatedAtFrom *time.Time `json:"updated_at_from"`
	UpdatedAtTo   *time.Time `json:"updated_at_to"`
}

// BoardCodeFilter struct for filtering BoardCodes
type BoardCodeFilter struct {
	Code          string     `json:"code"`
	Brand         string     `json:"brand"`
	Status        string     `json:"status"`
	Remark        string     `json:"remark"`
	CreatedAtFrom *time.Time `json:"created_at_from"`
	CreatedAtTo   *time.Time `json:"created_at_to"`
	UpdatedAtFrom *time.Time `json:"updated_at_from"`
	UpdatedAtTo   *time.Time `json:"updated_at_to"`
}

// BatchCreateCPUCode struct for batch creating CPUCodes
type BatchCreateCPUCode struct {
	Store  string   `json:"store"`
	Remark string   `json:"remark"`
	Codes  []string `json:"codes"`
}

// BatchCreateBoardCode struct for batch creating BoardCodes
type BatchCreateBoardCode struct {
	Brand string   `json:"brand"`
	Remark string   `json:"remark"`
	Codes  []string `json:"codes"`
}

// App struct
type App struct {
	ctx context.Context
	db *gorm.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	
	// Initialize the database and insert test records
	db, err := InitDB()
	a.db = db
	if err != nil {
		fmt.Printf("Failed to initialize database: %v\n", err)
	}
}

func (a *App) BatchCreateBoardCodes(batchCreateBoardCode BatchCreateBoardCode) error {
	codes := batchCreateBoardCode.Codes
	brand := batchCreateBoardCode.Brand
	remark := batchCreateBoardCode.Remark	
	db := a.db
	// insert codes into database
	for _, code := range codes {
		// set status to new, updated_at to current time, created_at to current time
		db.Create(&BoardCode{Code: code, Brand: brand, Remark: remark, Status: "unused", UpdatedAt: time.Now(), CreatedAt: time.Now()})
	}
	return nil
}

func (a *App) BatchCreateCPUCodes(batchCreateCPUCode BatchCreateCPUCode) error {
	codes := batchCreateCPUCode.Codes
	store := batchCreateCPUCode.Store
	remark := batchCreateCPUCode.Remark
	db := a.db
	// insert codes into database
	for _, code := range codes {
		// set status to new, updated_at to current time, created_at to current time
		db.Create(&CPUCode{Code: code, Store: store, Remark: remark, Status: "unused", UpdatedAt: time.Now(), CreatedAt: time.Now()})
	}
	return nil
}

// ListCPUCodes returns a paginated list of CPUCodes with optional filtering
func (a *App) ListCPUCodes(page int, size int, filter CPUCodeFilter) (*ListResponse, error) {
	db := a.db
	var cpuCodes []CPUCode
	var total int64

	query := db.Model(&CPUCode{})

	// Apply filters
	if filter.Code != "" {
		query = query.Where("code LIKE ?", "%"+filter.Code+"%")
	}
	if filter.Store != "" {
		query = query.Where("store LIKE ?", "%"+filter.Store+"%")
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Remark != "" {
		query = query.Where("remark LIKE ?", "%"+filter.Remark+"%")
	}
	if filter.CreatedAtFrom != nil {
		query = query.Where("created_at >= ?", filter.CreatedAtFrom)
	}
	if filter.CreatedAtTo != nil {
		query = query.Where("created_at <= ?", filter.CreatedAtTo)
	}
	if filter.UpdatedAtFrom != nil {
		query = query.Where("updated_at >= ?", filter.UpdatedAtFrom)
	}
	if filter.UpdatedAtTo != nil {
		query = query.Where("updated_at <= ?", filter.UpdatedAtTo)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, fmt.Errorf("failed to count total records: %v", err)
	}

	// Paginate
	offset := (page - 1) * size
	if err := query.Offset(offset).Limit(size).Find(&cpuCodes).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve CPU codes: %v", err)
	}

	return &ListResponse{
		Pagination: Pagination{
			Total: total,
			Page:  page,
			Size:  size,
		},
		Data: cpuCodes,
	}, nil
}

// ListBoardCodes returns a paginated list of BoardCodes with optional filtering
func (a *App) ListBoardCodes(page int, size int, filter BoardCodeFilter) (*ListResponse, error) {
	db := a.db

	var boardCodes []BoardCode
	var total int64

	query := db.Model(&BoardCode{})

	// Apply filters
	if filter.Code != "" {
		query = query.Where("code LIKE ?", "%"+filter.Code+"%")
	}
	if filter.Brand != "" {
		query = query.Where("brand LIKE ?", "%"+filter.Brand+"%")
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Remark != "" {
		query = query.Where("remark LIKE ?", "%"+filter.Remark+"%")
	}
	if filter.CreatedAtFrom != nil {
		query = query.Where("created_at >= ?", filter.CreatedAtFrom)
	}
	if filter.CreatedAtTo != nil {
		query = query.Where("created_at <= ?", filter.CreatedAtTo)
	}
	if filter.UpdatedAtFrom != nil {
		query = query.Where("updated_at >= ?", filter.UpdatedAtFrom)
	}
	if filter.UpdatedAtTo != nil {
		query = query.Where("updated_at <= ?", filter.UpdatedAtTo)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, fmt.Errorf("failed to count total records: %v", err)
	}

	// Paginate
	offset := (page - 1) * size
	if err := query.Offset(offset).Limit(size).Find(&boardCodes).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve Board codes: %v", err)
	}

	return &ListResponse{
		Pagination: Pagination{
			Total: total,
			Page:  page,
			Size:  size,
		},
		Data: boardCodes,
	}, nil
}

// InitDB initializes the database and creates tables if they don't exist
func InitDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("auto_scan.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %v", err)
	}

	// Auto Migrate the schema
	err = db.AutoMigrate(&CPUCode{}, &BoardCode{})
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %v", err)
	}

	// Insert test records
	err = insertTestRecords(db)
	if err != nil {
		return nil, fmt.Errorf("failed to insert test records: %v", err)
	}

	return db, nil
}

// insertTestRecords inserts some test records for each model
func insertTestRecords(db *gorm.DB) error {
	// Check if records already exist
	var count int64
	db.Model(&CPUCode{}).Count(&count)
	if count > 0 {
		return nil // Records already exist, skip insertion
	}

	// Insert test CPU codes
	cpuCodes := []CPUCode{
		{Code: "CPU001", Store: "Store A", Status: "unused", Remark: "Test CPU 1"},
		{Code: "CPU002", Store: "Store B", Status: "unused", Remark: "Test CPU 2"},
		{Code: "CPU003", Store: "Store C", Status: "unused", Remark: "Test CPU 3"},
	}
	if err := db.Create(&cpuCodes).Error; err != nil {
		return err
	}

	// Insert test Board codes
	boardCodes := []BoardCode{
		{Code: "BOARD001", Brand: "Brand X", Status: "unused", Remark: "Test Board 1"},
		{Code: "BOARD002", Brand: "Brand Y", Status: "used", Remark: "Test Board 2"},
		{Code: "BOARD003", Brand: "Brand Z", Status: "unused", Remark: "Test Board 3"},
	}
	if err := db.Create(&boardCodes).Error; err != nil {
		return err
	}

	return nil
}
