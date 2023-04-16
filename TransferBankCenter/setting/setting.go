package setting

import (
	"encoding/json"
	"log"
	"time"

	"github.com/go-ini/ini"
)

// App ... Define struct
type App struct {
	StatusSuccess   int
	StatusError     int
	AppURL          string
	LoginMaxAttempt int
	LoginBlockTime  int
	MaximumFileSize int
}

// AppSetting ... Init object
var AppSetting = &App{}

// Paginator ... Define struct
type Paginator struct {
	PageSize int `env:"PAGINATOR_PAGE_SIZE"`
}

// PaginatorSetting ... Init object
var PaginatorSetting = &Paginator{}

// Server ... Define struct
type Server struct {
	RunMode                       string        `env:"SERVER_RUN_MODE"`
	HTTPPort                      int           `env:"SERVER_HTTP_PORT"`
	ReadTimeout                   time.Duration `env:"SERVER_READ_TIMEOUT"`
	WriteTimeout                  time.Duration `env:"SERVER_WRITE_TIMEOUT"`
	JWTAccessTokenSecretKey       string        `env:"SERVER_JWT_ACCESS_TOKEN_SECRET_KEY"`
	JWTAccessTokenExpireMinutes   time.Duration `env:"SERVER_JWT_ACCESS_TOKEN_EXPIRE_MINUTES"`
	JWTAccessTokenRedisPrefix     string        `env:"SERVER_JWT_ACCESS_TOKEN_REDIS_PREFIX"`
	JWTRefreshTokenSecretKey      string        `env:"SERVER_JWT_REFRESH_TOKEN_SECRET_KEY"`
	JWTRefreshTokenExpireHours    time.Duration `env:"SERVER_JWT_REFRESH_TOKEN_EXPIRE_HOURS"`
	JWTRefreshTokenRedisPrefix    string        `env:"SERVER_JWT_REFRESH_TOKEN_REDIS_PREFIX"`
	ConversationPublicSecreateKey string        `env:"SERVER_CONVERSATIONPUBLIC_SECREATE_KEY"`
	FrontEndRoot                  string        `env:"SERVER_FRONTEND_ROOT"`
	CorsWhitelist                 string        `env:"CORS_WHITE_LIST"`
}

// ServerSetting ... Init object
var ServerSetting = &Server{}

// Database ... Define struct
type Database struct {
	Type               string `env:"DATABASE_TYPE"`
	User               string `env:"DATABASE_USER"`
	Password           string `env:"DATABASE_PASSWORD"`
	Host               string `env:"DATABASE_HOST"`
	Name               string `env:"DATABASE_NAME"`
	TablePrefix        string `env:"DATABASE_TABLE_PREFIX"`
	MaxIdleConnections int    `env:"DATABASE_MAX_IDLE_CONNECTIONS"`
	MaxOpenConnections int    `env:"DATABASE_MAX_OPEN_CONNECTIONS"`
}

// DatabaseSetting ... Init object
var DatabaseSetting = &Database{}

// Redis ... Define struct
type Redis struct {
	RedisAddress  string `env:"REDIS_ADDRESS"`
	RedisPassword string `env:"REDIS_PASSWORD"`
	RedisDB       int    `env:"REDIS_DB"`
}

// RedisSetting ... Init object
var RedisSetting = &Redis{}

// FileManager ...
type FileManager struct {
	AudioReceivedRoot      string `env:"FILEMANAGER_AUDIO_RECEIVED_ROOT"`
	AudioConvertedRoot     string `env:"FILEMANAGER_AUDIO_CONVERTED_ROOT"`
	BlacklistFileRoot      string `env:"FILEMANAGER_BLACKLIST_FILE_ROOT"`
	ReportFileRoot         string `env:"FILEMANAGER_REPORT_FILE_ROOT"`
	ScenarioReportFileRoot string `env:"FILEMANAGER_SCENARIO_REPORT_FILE_ROOT"`
	BillingReportFileRoot  string `env:"FILEMANAGER_BILLING_REPORT_FILE_ROOT"`
	Ar                     int    `env:"FILEMANAGER_AR"`
	Ac                     int    `env:"FILEMANAGER_AC"`
	PlanDetailRoot         string `env:"FILEMANAGER_PLAND_DETAIL_ROOT"`
}

// FileManagerSetting ...
var FileManagerSetting = &FileManager{}

type RBMQInfo struct {
	Username                             string  `env:"RBMQ_USERNAME"`
	Password                             string  `env:"RBMQ_PASSWORD"`
	Host                                 string  `env:"RBMQ_HOST"`
	Port                                 int     `env:"RBMQ_PORT"`
	CampaignQueueName                    string  `env:"RBMQ_CAMPAIGN_QUEUE_NAME"`
	ConversationQueueName                string  `env:"RBMQ_CONVERSATION_QUEUE_NAME"`
	InitConversationQueueName            string  `env:"RBMQ_INIT_CONVERSATION_QUEUE_NAME"`
	InitConversationMessageRatePerSecond float64 `env:"RBMQ_INIT_CONVERSATION_MESSAGE_RATE"`
	ConnectionURL                        string  `env:"RBMQ_CONNECTION_URL"`
	IsSSL                                bool    `env:"RBMQ_IS_SSL"`
	ManagementHost                       string  `env:"RBMQ_RABBITMQ_MANAGEMENT_HOST"`
}

var RBMQInfoSetting = &RBMQInfo{}

var ScenarioElementTypeMapping map[string]string

// CallDurationSplit
type CallDurationSplit struct {
	StartTime int64 `env:"CALLDURATIONSPLIT_START_TIME"`
	EndTime   int64 `env:"CALLDURATIONSPLIT_END_TIME"`
}

var CallDurationSplitList = make([]CallDurationSplit, 0)

// CallTimeSplit
type CallTimeSplit struct {
	DailyStartTime int `env:"CALLTIMESPLIT_DAILY_START_TIME"`
	DailyEndTime   int `env:"CALLTIMESPLIT_DAILY_END_TIME"`
}

var CallTimeSplitList = make([]CallTimeSplit, 0)

type TTS struct {
	TTSAreaToVoiceID        string `env:"TTS_TTS_AREA_VOICE_ID"`
	TTSAreaToVoiceIDDefault string `env:"TTS_TTS_AREA_TO_VOICE_ID_DEFAULT"`
	TTSToken                string `env:"TTS_TTS_TOKEN"`
	TTSSubmitURL            string `env:"TTS_TTS_SUBMIT_URL"`
	TTSGetURL               string `env:"TTS_TTS_GET_URL"`
	DefaultLanguageID       string `env:"TTS_DEFAULT_LANGUAGE_ID"`
}

type API struct {
	JWTTokenSecretKey     string
	JWTTokenExpireMinutes int
	JWTRedisPrefix        string
	JWTRoleTokenSecretKey string
}

type LDAP struct {
	UseLDAP        bool
	Address        string
	ServerName     string
	UsernameSuffix string
	BaseDN         string
	BindUsername   string
	BindPassword   string
	BindOnly       bool
	IsRequired     bool
	UseBindUser    bool
	UseTLS         bool
	Timeout        int64
}

type Log struct {
	LogType           string
	LogDir            string
	LogFile           string
	IsSeparateLogAuth bool
	LogAuthFile       string
}

type Call struct {
	DefaultCallPrice float64
}

type PartnerAPI struct {
	PartnerAPIURL string
}

type APMAgent struct {
	APMAgentActivate bool
}

type BillingService struct {
	Address               string
	GetActiveBilling      string
	GetBillingById        string
	GetBillingList        string
	GetBillingTransaction string
	GetDeposit            string
	GetTransaction        string
	GetTransactionFile    string
	CheckAvailabilityCall string
	MaxPointMonitor       int
}

type CallBotRASA struct {
	ExclusiveInputSlot []string
}

type Report struct {
	UniqueValueMax               int
	NilSheetName                 string
	ConversationStatusCodeIgnore []int
}

var LDAPSetting *LDAP = &LDAP{}

var APISetting *API = &API{}

var TTSSetting *TTS = &TTS{}

var LogSetting *Log = &Log{}

var CallSetting *Call = &Call{}

var PartnerAPISetting *PartnerAPI = &PartnerAPI{}

var APMAgentSetting *APMAgent = &APMAgent{}

var TTSAreaToVoiceIDMap map[string]interface{}

var CheckRoleData map[string]interface{}

var cfg *ini.File

var BillingServiceSetting *BillingService = &BillingService{}

var CallBotRASASetting *CallBotRASA = &CallBotRASA{}

var ReportSetting *Report = &Report{}

// Setup ... Initialize the configuration instance
func Setup(isDeploy *bool) {
	var err error
	cfg, err = ini.Load("conf/app.ini")
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse 'conf/app.ini': %v", err)
	}
	if isDeploy == nil || !*isDeploy {
		mapTo("app", AppSetting)
		mapTo("server", ServerSetting)
		mapTo("database", DatabaseSetting)
		mapTo("redis", RedisSetting)
		mapTo("paginator", PaginatorSetting)
		mapTo("file", FileManagerSetting)
		mapTo("rbmq", RBMQInfoSetting)
		mapTo("tts", TTSSetting)
		mapTo("api", APISetting)
		mapTo("ldap", LDAPSetting)
		mapTo("log", LogSetting)
		mapTo("call", CallSetting)
		mapTo("partner", PartnerAPISetting)
		mapTo("apm", APMAgentSetting)
		mapTo("billing", BillingServiceSetting)
		mapTo("rasa", CallBotRASASetting)
		mapTo("report", ReportSetting)
	} else {
		parseFromEnvs(AppSetting)
		parseFromEnvs(ServerSetting)
		parseFromEnvs(DatabaseSetting)
		parseFromEnvs(RedisSetting)
		parseFromEnvs(PaginatorSetting)
		parseFromEnvs(FileManagerSetting)
		parseFromEnvs(RBMQInfoSetting)
		parseFromEnvs(TTSSetting)
	}

	TTSAreaToVoiceIDMap = make(map[string]interface{})
	err = json.Unmarshal([]byte(TTSSetting.TTSAreaToVoiceID), &TTSAreaToVoiceIDMap)
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse '%s': %v", "conf/app.ini", err)
	}
	log.Printf("[info] Setup | TTSAreaToVoiceIDMap: %v", TTSAreaToVoiceIDMap)

	ServerSetting.ReadTimeout = ServerSetting.ReadTimeout * time.Second
	ServerSetting.WriteTimeout = ServerSetting.WriteTimeout * time.Second
	ServerSetting.JWTAccessTokenExpireMinutes = ServerSetting.JWTAccessTokenExpireMinutes * time.Minute
	ServerSetting.JWTRefreshTokenExpireHours = ServerSetting.JWTRefreshTokenExpireHours * time.Hour

	ScenarioElementTypeMapping = map[string]string{
		"app.ScenarioStart":     "trigger",
		"app.GatherInputOnCall": "gather-input-on-call",
		"app.SetVariables":      "set-variables",
		"app.PlayOrSay":         "say-play",
		"app.SplitBasedOn":      "split-based-on",
		"app.ConnectCallTo":     "connect-call-to",
		"app.ScenarioEnd":       "scenario-end",
		"app.CallBotNLPAPI":     "callbot-nlp-api",
		"app.HttpApi":           "http-api",
	}

	CallDurationSplitList = append(CallDurationSplitList, CallDurationSplit{
		StartTime: 0,
		EndTime:   1000 * 30,
	})
	CallDurationSplitList = append(CallDurationSplitList, CallDurationSplit{
		StartTime: 1000 * 31,
		EndTime:   1000 * 60,
	})
	CallDurationSplitList = append(CallDurationSplitList, CallDurationSplit{
		StartTime: 1000 * 61,
		EndTime:   1000 * 120,
	})
	CallDurationSplitList = append(CallDurationSplitList, CallDurationSplit{
		StartTime: 1000 * 121,
		EndTime:   1000 * 600,
	})
	CallDurationSplitList = append(CallDurationSplitList, CallDurationSplit{
		StartTime: 1000 * 601,
		EndTime:   1000 * 9999999999,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 0,
		DailyEndTime:   3,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 4,
		DailyEndTime:   7,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 8,
		DailyEndTime:   11,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 12,
		DailyEndTime:   15,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 16,
		DailyEndTime:   19,
	})

	CallTimeSplitList = append(CallTimeSplitList, CallTimeSplit{
		DailyStartTime: 20,
		DailyEndTime:   23,
	})

	// policyFile, err := os.Open("metadata/policy.json")
	// if err != nil {
	// 	log.Fatalf("[error] can't load policy.json: %v", err)
	// }
	// defer policyFile.Close()
	// policyByteValue, _ := ioutil.ReadAll(policyFile)

	// err = json.Unmarshal(policyByteValue, &CheckRoleData)
	// if err != nil {
	// 	log.Fatalf("[error] can't load policy.json: %v", err)
	// }
}

// mapTo ... Map section
func mapTo(section string, v interface{}) {
	err := cfg.Section(section).MapTo(v)
	if err != nil {
		log.Fatalf("Cfg.MapTo %s err: %v", section, err)
	}
}
