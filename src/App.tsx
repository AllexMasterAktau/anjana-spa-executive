import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Users, 
  MapPin, 
  Award, 
  DollarSign, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Percent, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  BookOpen, 
  ThumbsUp, 
  Volume2,
  Info,
  Layers,
  Sparkle,
  Menu,
  X
} from "lucide-react";
import { COSMETIC_TREATMENTS, CUSTOMER_SEGMENTS, MARKETING_CALENDAR, SALES_SCRIPTS } from "./data";
import { CosmeticTreatment, CustomerSegment, MarketingCampaign, ScriptStep } from "./types";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("positioning");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Simulator Inputs
  const [dailyGuests, setDailyGuests] = useState<number>(12);
  const [treatmentPrice, setTreatmentPrice] = useState<number>(60000);
  const [restaurantConv, setRestaurantConv] = useState<number>(45);
  const [restaurantAOV, setRestaurantAOV] = useState<number>(15000);
  const [retailConv, setRetailConv] = useState<number>(25);
  const [showRetailInfo, setShowRetailInfo] = useState<boolean>(false);
  const [retailAOV, setRetailAOV] = useState<number>(35000);
  const [vipCabinRate, setVipCabinRate] = useState<number>(20);
  const [vipCabinPrice] = useState<number>(30000);
  const [daysActive, setDaysActive] = useState<number>(30);
  const [therapistSalary, setTherapistSalary] = useState<number>(350000);
  const [therapistsCount, setTherapistsCount] = useState<number>(6);
  const [marketingSpend, setMarketingSpend] = useState<number>(800000);
  const [rentAndUtilities] = useState<number>(2000000); // Fixed monthly overhead for SPA zone

  const capacityLimit = therapistsCount * 3;

  // Interactive Package Picker
  const [selectedPackage, setSelectedPackage] = useState<CosmeticTreatment>(COSMETIC_TREATMENTS[0]);

  // Interactive Persona Picker
  const [selectedPersona, setSelectedPersona] = useState<CustomerSegment>(CUSTOMER_SEGMENTS[0]);

  // Interactive Script Objection State
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [isScriptPlaying, setIsScriptPlaying] = useState<boolean>(false);

  // Therapist KPI Calculator States
  const [therapistProceduresCount, setTherapistProceduresCount] = useState<number>(40);
  const [therapistRetailConv, setTherapistRetailConv] = useState<number>(30);
  const [therapistRetailAOV, setTherapistRetailAOV] = useState<number>(35000);
  const [therapistRetailComm, setTherapistRetailComm] = useState<number>(10);

  // Preset Scenario Handlers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "conservative":
        setDailyGuests(4);
        setRestaurantConv(20);
        setRetailConv(10);
        setVipCabinRate(10);
        setMarketingSpend(400000);
        break;
      case "optimal":
        setDailyGuests(12);
        setRestaurantConv(45);
        setRetailConv(25);
        setVipCabinRate(20);
        setMarketingSpend(800000);
        break;
      case "maximum":
        setDailyGuests(18);
        setRestaurantConv(60);
        setRetailConv(40);
        setVipCabinRate(35);
        setMarketingSpend(1500000);
        break;
      default:
        break;
    }
  };

  // Financial Calculations
  const financialMetrics = useMemo(() => {
    // 1. Treatments Revenue
    const treatmentsRev = dailyGuests * treatmentPrice * daysActive;
    
    // 2. F&B Revenue
    const fbRev = dailyGuests * (restaurantConv / 100) * restaurantAOV * daysActive;
    
    // 3. VIP Room Rental Revenue
    const vipRev = dailyGuests * (vipCabinRate / 100) * vipCabinPrice * daysActive;
    
    // 4. Retail Cosmetics Revenue
    const retailRev = dailyGuests * (retailConv / 100) * retailAOV * daysActive;
    
    // Total Revenue
    const totalRev = treatmentsRev + fbRev + vipRev + retailRev;

    // --- COGS and Expenses ---
    // Treatment COGS (La Sultane products used per treatment)
    const avgTreatmentCOGS = selectedPackage.cogs; // Dynamic based on currently selected package
    const treatmentCOGS = dailyGuests * avgTreatmentCOGS * daysActive;
    
    // Therapist Salaries (Fixed Monthly Salaries)
    const therapistComm = therapistSalary * therapistsCount;
    
    // F&B Costs (assuming 35% hospitality food cost)
    const fbCost = fbRev * 0.35;
    
    // Retail Cosmetics COGS (50% based on Senior Distributor 50% discount)
    const retailCOGS = retailRev * 0.50;
    
    // Total Variable/Staff Costs
    const totalVariableCosts = treatmentCOGS + therapistComm + fbCost + retailCOGS;

    // Marketing + Fixed Overhead
    const fixedOverhead = rentAndUtilities + marketingSpend;

    // EBITDA
    const ebitda = totalRev - totalVariableCosts - fixedOverhead;
    
    // EBITDA Margin
    const ebitdaMargin = totalRev > 0 ? (ebitda / totalRev) * 100 : 0;

    // Cost Per Guest (Fixed Master Salary shared over total procedures + Product COGS)
    const totalProceduresInMonth = dailyGuests * daysActive;
    const therapistCostPerGuest = totalProceduresInMonth > 0 ? (therapistSalary * therapistsCount) / totalProceduresInMonth : 0;
    const totalCostOfOffer = avgTreatmentCOGS + therapistCostPerGuest;
    const profitMarginPerOffer = treatmentPrice - totalCostOfOffer;

    return {
      treatmentsRev,
      fbRev,
      vipRev,
      retailRev,
      totalRev,
      treatmentCOGS,
      therapistComm,
      fbCost,
      retailCOGS,
      totalVariableCosts,
      fixedOverhead,
      ebitda,
      ebitdaMargin,
      totalCostOfOffer,
      profitMarginPerOffer
    };
  }, [
    dailyGuests,
    treatmentPrice,
    restaurantConv,
    restaurantAOV,
    retailConv,
    retailAOV,
    vipCabinRate,
    vipCabinPrice,
    daysActive,
    therapistSalary,
    therapistsCount,
    marketingSpend,
    selectedPackage,
    rentAndUtilities
  ]);

  // Therapist Monthly Commission
  const therapistCalculatedCommission = useMemo(() => {
    const baseTreatmentEarnings = therapistSalary;
    const retailSalesCount = Math.round(therapistProceduresCount * (therapistRetailConv / 100));
    const totalRetailVolume = retailSalesCount * therapistRetailAOV;
    const retailCommissionEarnings = totalRetailVolume * (therapistRetailComm / 100);
    const totalTherapistEarnings = baseTreatmentEarnings + retailCommissionEarnings;

    return {
      baseTreatmentEarnings,
      retailSalesCount,
      totalRetailVolume,
      retailCommissionEarnings,
      totalTherapistEarnings
    };
  }, [therapistProceduresCount, therapistSalary, therapistRetailConv, therapistRetailAOV, therapistRetailComm]);

  // Capacity Warning State
  const isOverCapacity = dailyGuests > capacityLimit;
  const capacityUtilization = (dailyGuests / capacityLimit) * 100;

  return (
    <div className="min-h-screen bg-amber-50/20 text-neutral-900 selection:bg-gold-200 selection:text-gold-900 flex flex-col">
      
      {/* Premium Header */}
      <header className="border-b border-gold-200 bg-white shadow-xs sticky top-0 z-45">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-gold-600 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-sm">
                    RIXOS WATER WORLD AKTAU 5*
                  </span>
                  <span className="border border-gold-300 text-gold-700 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-sm">
                    ANJANA SPA
                  </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 mt-2 font-luxury sm:text-2xl">
                  Стратегический Антикризисный План (Низкий Сезон)
                </h1>
                <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                  Интерактивная панель управления доходами, симулятор загрузки и дорожная карта вывода косметики <strong className="text-gold-700 font-medium">La Sultane de Saba</strong>.
                </p>
              </div>
              
              {/* Mobile menu toggle button */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 focus:outline-none md:hidden ml-4 cursor-pointer"
                id="mobile-menu-toggle"
              >
                <span className="sr-only">Открыть меню</span>
                {isMobileSidebarOpen ? (
                  <X className="h-6 w-6 text-neutral-600" />
                ) : (
                  <Menu className="h-6 w-6 text-neutral-600" />
                )}
              </button>
            </div>
            
            <div className="flex flex-col items-start gap-1 rounded-lg bg-gold-50 border border-gold-100 p-3 self-start md:self-center shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-gold-800 font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" /> Текущий период планирования
              </span>
              <span className="text-sm font-semibold text-neutral-800 mt-0.5">
                Октябрь – Апрель (Зимний сезон)
              </span>
              <span className="text-xs text-neutral-500">
                Загрузка номеров минимальна • Приоритет на городской трафик
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto relative">
        
        {/* Left Navigation Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gold-200 p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 md:h-[calc(100vh-130px)] md:sticky md:top-[110px] flex flex-col justify-between shrink-0
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          id="sidebar-navigation"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between md:hidden">
              <span className="text-sm font-bold uppercase tracking-wider text-gold-700 font-luxury">МЕНЮ ПАНЕЛИ</span>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-3 mb-3">РАЗДЕЛЫ СТРАТЕГИИ</p>
              
              {[
                { id: "positioning", label: "🪐 Позиционирование", icon: MapPin },
                { id: "simulator", label: "📊 Финансовый Симулятор", icon: Calculator },
                { id: "matrix", label: "🎁 Пакетная Матрица", icon: Layers },
                { id: "calendar", label: "📅 Календарь Маркетинга", icon: Calendar },
                { id: "scripts", label: "💬 Скрипты Продаж & Ритейл", icon: MessageSquare },
                { id: "motivation", label: "🎯 Мотивация & KPI", icon: Award },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-gold-50 text-gold-800 border-l-4 border-gold-600 font-semibold pl-2 shadow-xs"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                    id={`sidebar-btn-${tab.id}`}
                  >
                    <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-gold-600" : "text-neutral-400 group-hover:text-neutral-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <div className="rounded-lg bg-gold-50/60 p-3 border border-gold-100/50 text-center">
              <span className="text-[10px] text-gold-800 font-bold tracking-widest block uppercase font-luxury">La Sultane de Saba</span>
              <span className="text-[9px] text-neutral-400 block mt-1">Премиальный уход Парижа</span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs transition-opacity md:hidden"
            id="sidebar-overlay"
          ></div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* Tab content wrapper */}
          <div className="transition-all duration-300">
          
          {/* TAB 1: STRATEGIC POSITIONING */}
          {activeTab === "positioning" && (
            <div className="space-y-8 animate-fade-in" id="content-positioning">
              
              {/* Top Summary Card */}
              <div className="rounded-2xl border border-gold-200 bg-white p-6 md:p-8 shadow-xs">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <span className="inline-flex items-center rounded-md bg-gold-100 px-2.5 py-1 text-xs font-semibold text-gold-800">
                      ГЛАВНАЯ ИДЕЯ & ПОЗИЦИОНИРОВАНИЕ
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 font-luxury">
                      «Эликсир Уединения»: Превращение 20 км в элемент роскоши
                    </h2>
                    <p className="text-neutral-600 leading-relaxed text-base">
                      Загородное расположение Rixos Water World Aktau часто воспринимается городскими жителями как барьер. Наша стратегия переворачивает этот минус в безусловный плюс. Осенью и зимой загородная зона — это не упущенное время, это <strong>сознательное бегство от шума</strong>, гарантирующее абсолютную тишину, чистый морской воздух и умиротворение, недоступное внутри пыльного города.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-gold-100 p-1">
                          <CheckCircle className="h-4 w-4 text-gold-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 text-sm">Городской Оазис</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">Внутренний побег в спа-курорт без покупки авиабилетов.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-gold-100 p-1">
                          <CheckCircle className="h-4 w-4 text-gold-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 text-sm">Day SPA как Крючок</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">Высокочековая процедура от 60 000 KZT открывает термальный безлимит.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-4 rounded-xl bg-neutral-900 text-white p-6 space-y-4 border-l-4 border-gold-500">
                    <h3 className="text-lg font-bold font-luxury text-gold-300">ДНК Оффера (Day SPA)</h3>
                    <div className="space-y-3 text-xs text-neutral-300">
                      <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span>Базовый порог</span>
                        <span className="font-bold text-white">60 000 KZT</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span>Процедура</span>
                        <span className="font-bold text-white">Массаж / Уход (La Sultane)</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span>Термальная зона</span>
                        <span className="font-bold text-green-400">БЕСПЛАТНО (Безлимит)</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span>Доп. услуги отеля</span>
                        <span className="font-bold text-amber-400">Платные (Рестораны/VIP)</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      *Механика позволяет задействовать простаивающий персонал термальной зоны и мастеров в низкий сезон, генерируя моментальный денежный поток и обеспечивая допродажи косметики.
                    </p>
                  </div>
                </div>
              </div>

              {/* Four Customer Profiles */}
              <div>
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h3 className="text-2xl font-bold font-luxury text-neutral-900">Портреты Целевой Аудитории (Городской Трафик)</h3>
                  <p className="text-sm text-neutral-500 mt-1">Сегментация платежеспособных жителей Актау для точечного маркетинга</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {CUSTOMER_SEGMENTS.map((segment) => {
                    const isSelected = selectedPersona.id === segment.id;
                    return (
                      <div 
                        key={segment.id}
                        onClick={() => setSelectedPersona(segment)}
                        className={`cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
                          isSelected 
                            ? "border-gold-600 bg-gold-50/40 shadow-xs ring-1 ring-gold-600" 
                            : "border-neutral-200 bg-white hover:border-gold-300 hover:bg-neutral-50/50"
                        }`}
                        id={`persona-card-${segment.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
                            {segment.id === "burnout-execs" ? "👔 Топ-Менеджмент" : 
                             segment.id === "womens-clubs" ? "👯 Женские Клубы" : 
                             segment.id === "couples-recharge" ? "👩‍❤️‍👨 Романтика" : "📸 Бьюти-Блогеры"}
                          </span>
                          {isSelected && <span className="bg-gold-600 text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">Активен в симуляции</span>}
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900 mt-2 font-luxury">{segment.name}</h4>
                        <p className="text-xs text-gold-800 font-medium italic mt-0.5">«{segment.tagline}»</p>
                        
                        <div className="mt-4 space-y-2.5 text-xs text-neutral-600">
                          <div>
                            <strong className="text-neutral-800 block">Болевая точка:</strong>
                            {segment.painPoint}
                          </div>
                          <div>
                            <strong className="text-neutral-800 block">Психографика:</strong>
                            {segment.psychographic}
                          </div>
                          <div>
                            <strong className="text-neutral-800 block">Обход барьера 20 км:</strong>
                            <span className="text-gold-900 font-medium bg-gold-100/60 px-1 py-0.5 rounded-xs">{segment.barrierBypass}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Removing the Distance Barrier Mechanics */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-6">
                <h3 className="text-xl font-bold font-luxury text-neutral-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-600" />
                  Инструменты снятия барьера расстояния
                </h3>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-neutral-50 p-4 border-t-2 border-gold-400">
                    <span className="text-xs font-bold text-gold-700 uppercase">1. ПРЕМИАЛЬНЫЙ ТРАНСФЕР COMPLIMENTARY</span>
                    <h4 className="font-semibold text-neutral-900 text-sm mt-1">Интегрированный бизнес-класс</h4>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      При бронировании парного пакета или процедур на сумму свыше 120 000 KZT в стоимость включается трансфер на премиальном седане (Mercedes S-Class / Zeekr 001) в одну сторону. Это превращает дорогу в часть люксового ритуала.
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-50 p-4 border-t-2 border-gold-400">
                    <span className="text-xs font-bold text-gold-700 uppercase">2. КОЛЛАБОРАЦИЯ С КЛУБАМИ (WOMENS CLUB)</span>
                    <h4 className="font-semibold text-neutral-900 text-sm mt-1">Организованный выезд</h4>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Предоставление комфортабельного минивэна (Mercedes V-Class) на 5–7 мест для групповых визитов Womens Clubs или элитных девичников. Дорога становится временем для общения, дегустации детокс-напитков и обсуждения планов.
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-50 p-4 border-t-2 border-gold-400">
                    <span className="text-xs font-bold text-gold-700 uppercase">3. КОНЦЕПЦИЯ «ВЕЛНЕС-ОТШЕЛЬНИК»</span>
                    <h4 className="font-semibold text-neutral-900 text-sm mt-1">Загород как синоним уединения</h4>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Маркетинговые лозунги делают упор на невозможность глубокой перезагрузки внутри города: «Вы не сможете отпустить мысли в центре Актау, вас найдет суета. Позвольте себе 20 минут дороги к полной приватности».
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REVENUE & CAPACITY SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="space-y-8 animate-fade-in" id="content-simulator">
              
              {/* Presets and warning panel */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl bg-gold-50 border border-gold-200 p-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-gold-700" />
                    Выберите сценарий для быстрой настройки симулятора:
                  </h3>
                  <p className="text-xs text-neutral-500">Система автоматически подгрузит показатели загрузки в низкий сезон</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => applyPreset("conservative")} 
                    className="cursor-pointer rounded-lg bg-white border border-neutral-300 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    📉 Минимальный (4 гостя/день)
                  </button>
                  <button 
                    onClick={() => applyPreset("optimal")} 
                    className="cursor-pointer rounded-lg bg-gold-600 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-gold-700"
                  >
                    ✨ Оптимальный (12 гостей/день)
                  </button>
                  <button 
                    onClick={() => applyPreset("maximum")} 
                    className="cursor-pointer rounded-lg bg-white border border-neutral-300 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    🚀 Высокий Пик (18 гостей/день)
                  </button>
                </div>
              </div>

              {/* Main Calculator Grid */}
              <div className="grid gap-8 lg:grid-cols-12">
                
                {/* Left Side: Input Sliders */}
                <div className="lg:col-span-6 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-bold font-luxury text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-gold-600" />
                    Параметры операционной модели
                  </h3>

                  <div className="space-y-5">
                    
                    {/* Input: Daily Guests */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                          Дневной поток гостей (Day SPA) 
                          <span className="text-neutral-400 font-normal normal-case">(чел/день)</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number"
                            min="1"
                            max="100"
                            value={dailyGuests}
                            onChange={(e) => setDailyGuests(Math.min(100, Math.max(1, Number(e.target.value))))}
                            className={`w-16 text-center border rounded-md px-1.5 py-0.5 text-xs font-bold bg-white focus:outline-none focus:ring-1 ${
                              isOverCapacity 
                                ? "border-red-300 text-red-700 focus:ring-red-500 focus:border-red-500" 
                                : "border-neutral-300 text-neutral-800 focus:ring-gold-500 focus:border-gold-500"
                            }`}
                          />
                          <span className="text-xs text-neutral-500 font-medium">чел.</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="35" 
                        value={dailyGuests}
                        onChange={(e) => setDailyGuests(Number(e.target.value))}
                        className="w-full accent-gold-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>1 гость</span>
                        <span>Предел мастеров ({capacityLimit} чел)</span>
                        <span>35 гостей</span>
                      </div>
                    </div>

                    {/* Input: Base Offer Price */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                          Стоимость базового оффера (Процедуры)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number"
                            min="5000"
                            max="500000"
                            step="1000"
                            value={treatmentPrice}
                            onChange={(e) => setTreatmentPrice(Math.max(0, Number(e.target.value)))}
                            className="w-24 text-right border border-neutral-300 rounded-md px-1.5 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                          />
                          <span className="text-xs text-neutral-500 font-medium">KZT</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="40000" 
                        max="100000" 
                        step="5000"
                        value={treatmentPrice}
                        onChange={(e) => setTreatmentPrice(Number(e.target.value))}
                        className="w-full accent-gold-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                      />
                    </div>

                    {/* Split section for Conversions */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-neutral-100">
                      
                      {/* F&B conversion */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Конверсия в F&B (обед)</label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={restaurantConv}
                              onChange={(e) => setRestaurantConv(Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="w-12 text-center border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">%</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={restaurantConv}
                          onChange={(e) => setRestaurantConv(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />
                      </div>

                      {/* F&B AOV */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Средний чек F&B (KZT)</label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="200000"
                              step="500"
                              value={restaurantAOV}
                              onChange={(e) => setRestaurantAOV(Math.max(0, Number(e.target.value)))}
                              className="w-20 text-right border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">KZT</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="5000" 
                          max="30000" 
                          step="1000"
                          value={restaurantAOV}
                          onChange={(e) => setRestaurantAOV(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />
                      </div>

                    </div>

                    {/* Split section for Retail Cosmetics */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-neutral-100">
                      
                      {/* Retail conversion */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase flex items-center gap-1">
                            Конверсия в ритейл
                            <button 
                              type="button"
                              onClick={() => setShowRetailInfo(!showRetailInfo)}
                              className="inline-flex items-center justify-center p-0.5 text-gold-600 hover:text-gold-700 bg-gold-50 hover:bg-gold-100 rounded-full focus:outline-none cursor-pointer transition-colors"
                              title="Нажмите для подробного пояснения"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={retailConv}
                              onChange={(e) => setRetailConv(Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="w-12 text-center border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">%</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={retailConv}
                          onChange={(e) => setRetailConv(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />

                        {showRetailInfo && (
                          <div className="p-3 bg-gold-50/90 border border-gold-200/60 rounded-lg text-xs text-neutral-700 leading-relaxed shadow-xs space-y-1 relative sm:col-span-2">
                            <button 
                              onClick={() => setShowRetailInfo(false)}
                              className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-neutral-600 cursor-pointer text-xs font-bold"
                            >
                              ✕
                            </button>
                            <p className="font-bold text-gold-800 flex items-center gap-1">
                              ✨ Пояснение: Конверсия в ритейл
                            </p>
                            <p>
                              Это процент гостей Day SPA, которые приобретают домашний уход <strong className="text-neutral-900 font-semibold">La Sultane de Saba</strong> после процедуры.
                            </p>
                            <div className="pt-1 space-y-0.5 text-[11px]">
                              <p>📈 <span className="font-semibold text-neutral-900">Бенчмаркинг низкого сезона:</span></p>
                              <p>• <span className="font-medium text-amber-800">10% (Минимальный)</span> — пассивные продажи на витрине ресепшн.</p>
                              <p>• <span className="font-medium text-amber-800">25% (Оптимальный)</span> — активная нативная рекомендация мастера во время ухода.</p>
                              <p>• <span className="font-medium text-amber-800">40% и более (Высокий)</span> — синергия мастера и администратора ресепшн + проведение промо-тестов.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Retail AOV */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Средний чек ритейла (KZT)</label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="500000"
                              step="1000"
                              value={retailAOV}
                              onChange={(e) => setRetailAOV(Math.max(0, Number(e.target.value)))}
                              className="w-20 border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">KZT</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="20000" 
                          max="80000" 
                          step="5000"
                          value={retailAOV}
                          onChange={(e) => setRetailAOV(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />
                      </div>

                    </div>

                    {/* Split section for VIP cabins */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-neutral-100">
                      
                      {/* VIP rental conversion */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Аренда VIP-кабин (%)</label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={vipCabinRate}
                              onChange={(e) => setVipCabinRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="w-12 text-center border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">%</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={vipCabinRate}
                          onChange={(e) => setVipCabinRate(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />
                      </div>

                      {/* Marketing budget */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Бюджет маркетинга (мес)</label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="15000000"
                              step="50000"
                              value={marketingSpend}
                              onChange={(e) => setMarketingSpend(Math.max(0, Number(e.target.value)))}
                              className="w-24 text-right border border-neutral-300 rounded-md px-1 py-0.5 text-xs font-bold text-neutral-800 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                            />
                            <span className="text-xs text-neutral-500 font-medium">KZT</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="200000" 
                          max="3000000" 
                          step="100000"
                          value={marketingSpend}
                          onChange={(e) => setMarketingSpend(Number(e.target.value))}
                          className="w-full accent-gold-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                        />
                      </div>

                    </div>

                    {/* Active Days, Therapist Salary & Therapists Count */}
                    <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-neutral-100">
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Дней в месяце</label>
                          <span className="text-xs font-bold text-neutral-800">{daysActive} дней</span>
                        </div>
                        <input 
                          type="number" 
                          min="1" 
                          max="31" 
                          value={daysActive}
                          onChange={(e) => setDaysActive(Math.min(31, Math.max(1, Number(e.target.value))))}
                          className="w-full border border-neutral-300 rounded-md px-2 py-1 text-xs text-neutral-800 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Зарплата мастера в мес.</label>
                          <span className="text-xs font-bold text-neutral-800">{therapistSalary.toLocaleString()} KZT</span>
                        </div>
                        <input 
                          type="number" 
                          min="100000" 
                          max="1500000" 
                          step="10000"
                          value={therapistSalary}
                          onChange={(e) => setTherapistSalary(Math.max(0, Number(e.target.value)))}
                          className="w-full border border-neutral-300 rounded-md px-2 py-1 text-xs text-neutral-800 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-neutral-600 uppercase">Кол-во мастеров</label>
                          <span className="text-xs font-bold text-neutral-800">{therapistsCount} чел.</span>
                        </div>
                        <input 
                          type="number" 
                          min="1" 
                          max="35" 
                          value={therapistsCount}
                          onChange={(e) => setTherapistsCount(Math.min(35, Math.max(1, Number(e.target.value))))}
                          className="w-full border border-neutral-300 rounded-md px-2 py-1 text-xs text-neutral-800 bg-white"
                        />
                      </div>

                    </div>

                    {/* Cosmetic Package Reference selection (affects COGS) */}
                    <div className="pt-4 border-t border-neutral-100">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                        Базовая процедура для расчета себестоимости (COGS):
                      </label>
                      <select 
                        value={selectedPackage.name}
                        onChange={(e) => {
                          const matched = COSMETIC_TREATMENTS.find(t => t.name === e.target.value);
                          if (matched) setSelectedPackage(matched);
                        }}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-800 font-medium"
                      >
                        {COSMETIC_TREATMENTS.map((t) => (
                          <option key={t.name} value={t.name}>
                            {t.name} (Расход: {t.cogs.toLocaleString()} KZT)
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        *Для расчета прибыли берется реальная себестоимость косметических продуктов из проф. листов.
                      </span>
                    </div>

                  </div>

                </div>

                {/* Right Side: Financial Outputs Dashboard */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* EBITDA Scorecard */}
                  <div className="rounded-2xl bg-neutral-900 text-white p-6 shadow-md space-y-4 border-t-4 border-gold-400">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">Ежемесячный EBITDA</span>
                        <h4 className="text-3xl font-extrabold text-white mt-1 font-luxury">
                          {financialMetrics.ebitda.toLocaleString()} KZT
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 block">Маржинальность</span>
                        <span className={`inline-block text-lg font-bold mt-1 px-2 py-0.5 rounded-sm ${
                          financialMetrics.ebitdaMargin > 30 ? "text-green-400 bg-green-950/40" : 
                          financialMetrics.ebitdaMargin > 15 ? "text-amber-400 bg-amber-950/40" : "text-red-400 bg-red-950/40"
                        }`}>
                          {financialMetrics.ebitdaMargin.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2 pt-2">
                      <div className="rounded-lg bg-neutral-800/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Общий Доход (Месяц)</span>
                        <span className="text-sm font-bold text-white mt-1 block">
                          {financialMetrics.totalRev.toLocaleString()} KZT
                        </span>
                      </div>
                      <div className="rounded-lg bg-neutral-800/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Себестоимость косметики (COGS)</span>
                        <span className="text-sm font-bold text-amber-300 mt-1 block">
                          {financialMetrics.treatmentCOGS.toLocaleString()} KZT
                        </span>
                      </div>
                      <div className="rounded-lg bg-neutral-800/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">ЗП мастеров (ФОТ)</span>
                        <span className="text-sm font-bold text-neutral-200 mt-1 block">
                          {financialMetrics.therapistComm.toLocaleString()} KZT
                        </span>
                      </div>
                      <div className="rounded-lg bg-neutral-800/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Маркетинг + Постоянные</span>
                        <span className="text-sm font-bold text-neutral-200 mt-1 block">
                          {financialMetrics.fixedOverhead.toLocaleString()} KZT
                        </span>
                      </div>
                    </div>

                    {/* Operational Safety (Capacity Limit Indicators) */}
                    <div className="border-t border-neutral-800 pt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400">Утилизация ресурсов SPA-комплекса:</span>
                        <span className={`font-semibold ${isOverCapacity ? "text-red-400" : "text-gold-300"}`}>
                          {capacityUtilization.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isOverCapacity ? "bg-red-500" : "bg-gold-500"}`} 
                          style={{ width: `${Math.min(100, capacityUtilization)}%` }}
                        ></div>
                      </div>
                      {isOverCapacity && (
                        <div className="flex gap-2 rounded-lg bg-red-950/50 p-3 border border-red-800 text-xs text-red-200 mt-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong>⚠️ Превышен пределCapacity Limit!</strong> Вы зарегистрировали {dailyGuests} чел./день при лимите {capacityLimit} мастеров/кабин. Качество сервиса премиум-класса может пострадать из-за спешки или отсутствия мест в раздевалках. Рекомендуется расширить штат мастеров или лимитировать запись.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-neutral-400" />
                      Постатейная декомпозиция доходов (в месяц)
                    </h3>
                    
                    <div className="space-y-3.5 text-xs">
                      
                      {/* Day SPA Treatments */}
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-900 block">1. Продажи Day SPA процедур</span>
                          <span className="text-[10px] text-neutral-400">{dailyGuests} гостей × {treatmentPrice.toLocaleString()} KZT × {daysActive} дней</span>
                        </div>
                        <span className="font-bold text-neutral-950">{financialMetrics.treatmentsRev.toLocaleString()} KZT</span>
                      </div>

                      {/* F&B */}
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-900 block">2. Допродажи в Ресторанах / Свежем баре</span>
                          <span className="text-[10px] text-neutral-400">Конверсия {restaurantConv}% • Ср. чек {restaurantAOV.toLocaleString()} KZT</span>
                        </div>
                        <span className="font-bold text-neutral-950">{financialMetrics.fbRev.toLocaleString()} KZT</span>
                      </div>

                      {/* VIP Room Rentals */}
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-900 block">3. Аренда VIP-комнат (кабин Anjana)</span>
                          <span className="text-[10px] text-neutral-400">{vipCabinRate}% гостей выбирают доплату {vipCabinPrice.toLocaleString()} KZT</span>
                        </div>
                        <span className="font-bold text-neutral-950">{financialMetrics.vipRev.toLocaleString()} KZT</span>
                      </div>

                      {/* Retail Cosmetics */}
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-900 block">4. Продажи косметики в домашний уход (Ритейл)</span>
                          <span className="text-[10px] text-neutral-400">Конверсия {retailConv}% • Ср. чек {retailAOV.toLocaleString()} KZT • Французский бренд</span>
                        </div>
                        <span className="font-bold text-neutral-950">{financialMetrics.retailRev.toLocaleString()} KZT</span>
                      </div>

                      {/* Summary of COGS */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-semibold text-neutral-500">Прямые расходы на косметику (Уходы):</span>
                        <span className="font-semibold text-red-600">-{financialMetrics.treatmentCOGS.toLocaleString()} KZT</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-neutral-500">Расходы на закуп косметики для ритейла:</span>
                        <span className="font-semibold text-red-600">-{financialMetrics.retailCOGS.toLocaleString()} KZT</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-neutral-500">Фонд оплаты труда мастеров (Комиссия):</span>
                        <span className="font-semibold text-red-600">-{financialMetrics.therapistComm.toLocaleString()} KZT</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-neutral-500">Постоянные затраты комплекса + Маркетинг:</span>
                        <span className="font-semibold text-red-600">-{financialMetrics.fixedOverhead.toLocaleString()} KZT</span>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PACKAGE MATRIX */}
          {activeTab === "matrix" && (
            <div className="space-y-8 animate-fade-in" id="content-matrix">
              
              {/* Package introduction */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <div className="max-w-3xl space-y-2">
                  <h3 className="text-2xl font-bold font-luxury text-neutral-900">
                    Пакетная Матрица Day SPA на косметике La Sultane de Saba
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Готовые сценарии уходов, адаптированные под разные типы гостей. Базовым крючком выступает высокая маржинальность косметики — при закупке по дистрибьюторскому прайсу себестоимость процедур минимальна по отношению к цене продажи!
                  </p>
                </div>
              </div>

              {/* Bento grid of packages */}
              <div className="grid gap-6 md:grid-cols-3">
                {COSMETIC_TREATMENTS.map((treatment) => {
                  const isSelected = selectedPackage.name === treatment.name;
                  const grossProfit = treatment.recommendedPrice - treatment.cogs;
                  const marginPct = (grossProfit / treatment.recommendedPrice) * 100;

                  return (
                    <div 
                      key={treatment.name}
                      onClick={() => setSelectedPackage(treatment)}
                      className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
                        isSelected 
                          ? "border-gold-600 bg-gold-50/20 shadow-xs ring-1 ring-gold-600" 
                          : "border-neutral-200 bg-white hover:border-gold-300 hover:bg-neutral-50/50"
                      }`}
                      id={`package-card-${treatment.name}`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-400" />
                            {treatment.duration}
                          </span>
                          <span className="bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-sm">
                            {treatment.notes}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold font-luxury text-neutral-900 mt-3 leading-tight">{treatment.name}</h4>
                        <p className="text-xs text-neutral-600 mt-2 line-clamp-3">{treatment.description}</p>
                        
                        {/* Highlights of actions */}
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Шаги ритуала:</span>
                          <ul className="text-[11px] text-neutral-600 space-y-1 list-disc list-inside">
                            {treatment.actionSteps.slice(0, 3).map((step, idx) => (
                              <li key={idx} className="truncate">{step}</li>
                            ))}
                            {treatment.actionSteps.length > 3 && <li className="text-[10px] text-gold-700 italic font-medium">+ еще {treatment.actionSteps.length - 3} этапа</li>}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase block">Цена продажи:</span>
                          <span className="text-lg font-bold text-neutral-950">{treatment.recommendedPrice.toLocaleString()} KZT</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 uppercase block">Маржинальность:</span>
                          <span className="text-xs font-bold text-green-600">{marginPct.toFixed(0)}% (Прибыль: {(grossProfit / 1000).toFixed(0)}k)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected package detailed breakdown */}
              {selectedPackage && (
                <div className="rounded-2xl border border-gold-200 bg-white p-6 md:p-8 space-y-6 animate-fade-in" id="package-detail-panel">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block">Детальная калькуляция ухода</span>
                      <h3 className="text-2xl font-bold font-luxury text-neutral-900 mt-1">{selectedPackage.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Линейка продуктов: {selectedPackage.notes} | Ароматический профиль: {selectedPackage.aroma}</p>
                    </div>
                    <div className="mt-4 md:mt-0 bg-gold-50 border border-gold-100 rounded-xl px-4 py-3 flex gap-6 text-center">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase block">Общая себестоимость (COGS)</span>
                        <span className="text-base font-bold text-neutral-900">{selectedPackage.cogs.toLocaleString()} KZT</span>
                      </div>
                      <div className="border-l border-gold-200/60 pl-6">
                        <span className="text-[10px] text-neutral-400 uppercase block">Маржинальная прибыль</span>
                        <span className="text-base font-bold text-green-600">{(selectedPackage.recommendedPrice - selectedPackage.cogs).toLocaleString()} KZT</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    
                    {/* Left: Step-by-Step actions */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gold-600" />
                        Полный хронометраж и шаги процедуры:
                      </h4>
                      <ol className="space-y-3">
                        {selectedPackage.actionSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-xs text-neutral-600">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-[10px] font-bold text-gold-800">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Right: Product recipe & costs */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingBag className="h-4 w-4 text-gold-600" />
                        Калькуляция расхода косметики на 1 гостя:
                      </h4>
                      <div className="rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-neutral-100 text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-200">
                              <th className="px-4 py-2.5">Продукт La Sultane de Saba</th>
                              <th className="px-4 py-2.5 text-right">Расход на 1 уход (тг)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 text-neutral-700">
                            {selectedPackage.products.map((p, idx) => (
                              <tr key={idx} className="hover:bg-white/50">
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2 text-right font-semibold">{p.cost.toLocaleString()} ₸</td>
                              </tr>
                            ))}
                            <tr className="bg-gold-50/50 font-bold text-neutral-900">
                              <td className="px-4 py-2.5 text-gold-800">Итого себестоимость косметики на гостя:</td>
                              <td className="px-4 py-2.5 text-right text-gold-800">{selectedPackage.cogs.toLocaleString()} ₸</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Retail Upsell Pathways */}
                      <div className="rounded-xl border border-gold-100 bg-amber-50/20 p-4 space-y-3">
                        <h5 className="text-xs font-bold text-gold-900 uppercase tracking-wide flex items-center gap-1">
                          <Sparkle className="h-3.5 w-3.5 text-gold-700" />
                          Сценарий Ритейл-Допродажи (Retail Conversion)
                        </h5>
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                          По завершении этой процедуры кожа гостя максимально отзывчива, а парфюмерный шлейф сохраняется до 24 часов. Администратор на ресепшн должен продемонстрировать гостю розничную упаковку масла карите или лосьона этой же серии:
                          <strong className="text-neutral-800 block mt-1.5">«Мария, чтобы сохранить эту шелковистую текстуру кожи и дома в наш ветреный сезон, я рекомендую использовать оригинальное масло карите. Вот оно в нашем фирменном флаконе...»</strong>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: MARKETING CALENDAR */}
          {activeTab === "calendar" && (
            <div className="space-y-8 animate-fade-in" id="content-calendar">
              
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <div className="max-w-3xl space-y-2">
                  <h3 className="text-2xl font-bold font-luxury text-neutral-900">
                    Календарь Продвижения по Сезонным Триггерам (Октябрь – Апрель)
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Эффективный запуск кампаний, основанный на физиологических болях горожан в зимний период. Каждый блок содержит точечный оффер, каналы дистрибуции и B2B/B2C интеграцию.
                  </p>
                </div>
              </div>

              {/* Timeline Horizontal Blocks */}
              <div className="space-y-6">
                {MARKETING_CALENDAR.map((camp, index) => {
                  return (
                    <div 
                      key={camp.period} 
                      className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-xs transition-all"
                      id={`campaign-block-${index}`}
                    >
                      <div className="bg-neutral-900 text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-l-4 border-gold-500">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-gold-300 uppercase tracking-widest">{camp.period}</span>
                          <h4 className="text-lg font-bold font-luxury text-white mt-1">{camp.title}</h4>
                        </div>
                        <span className="inline-block mt-2 sm:mt-0 text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                          Триггер сезона: {camp.period.split(" ")[0]}
                        </span>
                      </div>

                      <div className="p-6 grid gap-6 md:grid-cols-12">
                        
                        {/* Left: Trigger & Focus */}
                        <div className="md:col-span-4 space-y-4 border-r border-neutral-100 pr-0 md:pr-6">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Боль / Триггер горожан:</span>
                            <p className="text-xs text-neutral-700 font-medium mt-1 leading-relaxed italic">«{camp.trigger}»</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Операционный фокус SPA:</span>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{camp.focusArea}</p>
                          </div>
                        </div>

                        {/* Middle: Key Offer */}
                        <div className="md:col-span-5 space-y-4">
                          <div className="rounded-xl bg-gold-50/50 border border-gold-100 p-4 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 flex items-center gap-1">
                              <Sparkle className="h-3 w-3 text-gold-700" /> Ключевой Лид-Магнит (Оффер):
                            </span>
                            <p className="text-xs font-bold text-neutral-900 leading-relaxed">{camp.offer}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Каналы привлечения:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {camp.channels.map((chan, idx) => (
                                <span key={idx} className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                                  {chan}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Retail & B2B Angles */}
                        <div className="md:col-span-3 space-y-4 border-l border-neutral-100 pl-0 md:pl-6">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Ударный товар ритейла:</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-900 mt-1">
                              <ShoppingBag className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                              {camp.retailHighlight}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">B2B корпоративное плечо:</span>
                            <p className="text-xs text-neutral-500 mt-1 leading-normal">{camp.b2bAngle}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: SALES SCRIPTS Trainer */}
          {activeTab === "scripts" && (
            <div className="space-y-8 animate-fade-in" id="content-scripts">
              
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <div className="max-w-3xl space-y-2">
                  <h3 className="text-2xl font-bold font-luxury text-neutral-900">
                    Готовые Скрипты Общения & Интерактивный Тренажер
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Сформированные речевые модули для персонала на всех этапах взаимодействия с гостем. Цель — снять барьер расстояния, совершить кросс-сейл услуг отеля и закрыть сделку на покупку косметики для домашнего ухода.
                  </p>
                </div>
              </div>

              {/* Step Navigation for scripts */}
              <div className="grid gap-4 sm:grid-cols-4">
                {SALES_SCRIPTS.map((script, index) => {
                  const isActive = activeObjectionIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveObjectionIndex(index);
                        setIsScriptPlaying(false);
                      }}
                      className={`cursor-pointer rounded-xl border p-4 text-left transition-all duration-300 ${
                        isActive 
                          ? "border-gold-600 bg-gold-50/30 ring-1 ring-gold-600 shadow-xs" 
                          : "border-neutral-200 bg-white hover:border-gold-300 hover:bg-neutral-50/50"
                      }`}
                      id={`script-btn-${index}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Этап {index + 1}</span>
                      <h4 className="text-xs font-bold text-neutral-900 mt-1 font-luxury truncate">{script.title.split(".")[1] || script.title}</h4>
                    </button>
                  );
                })}
              </div>

              {/* Selected script detail screen with Objection Playback Simulator */}
              {activeObjectionIndex !== null && (
                <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden shadow-xs animate-fade-in" id="script-detail-panel">
                  
                  {/* Top segment banner */}
                  <div className="bg-neutral-900 text-white p-5 border-l-4 border-gold-500 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">Активный скрипт</span>
                      <h3 className="text-xl font-bold font-luxury mt-1">{SALES_SCRIPTS[activeObjectionIndex].title}</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setIsScriptPlaying(!isScriptPlaying);
                        if (!isScriptPlaying) {
                          // simulates speech playback
                        }
                      }}
                      className="cursor-pointer mt-3 sm:mt-0 flex items-center gap-1.5 bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                      {isScriptPlaying ? "🎙️ Идет демонстрация..." : "🔊 Озвучить речевой модуль"}
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    
                    {/* Scenario Objection Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-red-50 border border-red-100 p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-700" /> Возражение / Ситуация гостя:
                        </span>
                        <h4 className="text-sm font-bold text-neutral-950 italic">«{SALES_SCRIPTS[activeObjectionIndex].scenario}»</h4>
                        <div className="text-[11px] text-neutral-500 mt-2">
                          <strong>Объект возражения:</strong> {SALES_SCRIPTS[activeObjectionIndex].objection}
                        </div>
                      </div>

                      <div className="rounded-xl bg-green-50/50 border border-green-100 p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-green-700" /> Профессиональный Лайфхак по допродажам:
                        </span>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {SALES_SCRIPTS[activeObjectionIndex].upsellTip}
                        </p>
                      </div>
                    </div>

                    {/* Speech response display */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100 relative">
                      {isScriptPlaying && (
                        <div className="absolute inset-0 bg-gold-50/10 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center">
                          <div className="bg-neutral-950 text-white rounded-full px-4 py-2 flex items-center gap-2 text-xs shadow-lg animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            Синтезатор речи имитирует идеальный тон администратора...
                          </div>
                        </div>
                      )}
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Речевой модуль администратора (Интонация: Любезная, Уверенная, Премиальная)</span>
                      
                      <div className="rounded-xl bg-gold-50/30 border border-gold-200 p-6">
                        <blockquote className="text-sm md:text-base text-neutral-800 leading-relaxed font-serif italic text-justify pl-4 border-l-2 border-gold-500">
                          {SALES_SCRIPTS[activeObjectionIndex].scriptResponse}
                        </blockquote>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 6: KPI & MOTIVATION */}
          {activeTab === "motivation" && (
            <div className="space-y-8 animate-fade-in" id="content-motivation">
              
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                <div className="max-w-3xl space-y-2">
                  <h3 className="text-2xl font-bold font-luxury text-neutral-900">
                    Система Мотивации (KPI) и Калькулятор Премий Персонала
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Разработаем систему стимуляции мастеров и рецепционистов, привязанную к розничным продажам косметики (La Sultane de Saba) и удержанию гостей. Это создаст здоровую вовлеченность всей команды в коммерческие цели отеля.
                  </p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-12">
                
                {/* Left: KPI rules structure */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Balanced Scorecard */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                    <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-3">
                      <Award className="h-5 w-5 text-gold-600" />
                      Сбалансированная матрица KPI для мастеров и ресепшн
                    </h4>

                    <div className="space-y-4 text-xs">
                      <div className="rounded-lg bg-neutral-50 p-4 border-l-4 border-gold-500">
                        <h5 className="font-bold text-neutral-900 text-sm">1. Мотивация для Администраторов Рецепции</h5>
                        <ul className="list-disc list-inside space-y-1.5 text-neutral-600 mt-2">
                          <li><strong>Бонус 10% от личного объема продаж</strong> косметики в розницу (ритейл на выходе).</li>
                          <li><strong>Премия за выполнение KPI по Retention Rate (Коэффициент возврата):</strong> при достижении показателя повторной записи гостей &gt; 35% за месяц, администратор получает супербонус 50 000 KZT.</li>
                          <li><strong>Командный бонус:</strong> 2% от продаж ресторанов/бара внутри спа за перевыполнение плана.</li>
                        </ul>
                      </div>

                      <div className="rounded-lg bg-neutral-50 p-4 border-l-4 border-gold-500">
                        <h5 className="font-bold text-neutral-900 text-sm">2. Мотивация для Мастеров-Терапевтов SPA</h5>
                        <ul className="list-disc list-inside space-y-1.5 text-neutral-600 mt-2">
                          <li><strong>Стабильный оклад {therapistSalary.toLocaleString()} KZT в месяц</strong> (согласно установленным ставкам для мастеров).</li>
                          <li><strong>Игровой бонус на запуск новой косметики:</strong> мастер, сделавший нативную презентацию, которая привела к покупке ритейла на ресепшн, получает <strong>5% от розничной цены проданного продукта</strong>.</li>
                          <li><strong>KPI по отзывам:</strong> за каждый персональный позитивный отзыв в Google Maps/TripAdvisor мастер получает премию 3 000 KZT.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Operational guidelines */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-3">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Чек-лист для контроля Retention Rate (Стандарты Luxury Experience)</h4>
                    <ul className="space-y-2 text-xs text-neutral-600">
                      <li className="flex gap-2 items-start">
                        <CheckCircle className="h-4 w-4 text-gold-600 mt-0.5 shrink-0" />
                        <span><strong>Звонок вежливости (Follow-up) через 48 часов:</strong> администратор звонит узнать самочувствие и состояние кожи гостя после ритуала. Предлагает забронировать следующий сеанс со скидкой 10%.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <CheckCircle className="h-4 w-4 text-gold-600 mt-0.5 shrink-0" />
                        <span><strong>Арома-Анкетирование:</strong> сохранение выбранного аромата гостя в его бьюти-карте. При следующем звонке предложить процедуру с полюбившимся ароматом Лотоса или Мускуса.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Right: Personal Master Commission Calculator */}
                <div className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6 space-y-6">
                  <h3 className="text-base font-bold font-luxury text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-1.5">
                    <Calculator className="h-5 w-5 text-gold-600" />
                    Калькулятор Премии Мастера (Ритейл Стимул)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Смоделируйте, насколько вырастет реальная ЗП мастера, если он начнет нативно рекомендовать гостям домашний уход La Sultane de Saba.
                  </p>

                  <div className="space-y-4">
                    
                    {/* Input: Procedures count */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Процедур в месяц (на 1 мастера):</span>
                        <span className="text-gold-700 font-bold">{therapistProceduresCount} сеансов</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="80" 
                        step="2"
                        value={therapistProceduresCount}
                        onChange={(e) => setTherapistProceduresCount(Number(e.target.value))}
                        className="w-full accent-gold-500 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                      />
                    </div>

                    {/* Input: Retail conversion */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Процент гостей, купивших ритейл по рекомендации мастера:</span>
                        <span className="text-gold-700 font-bold">{therapistRetailConv}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="80" 
                        step="5"
                        value={therapistRetailConv}
                        onChange={(e) => setTherapistRetailConv(Number(e.target.value))}
                        className="w-full accent-gold-500 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                      />
                    </div>

                    {/* Input: Average Retail Price */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Средний розничный чек косметики:</span>
                        <span className="text-gold-700 font-bold">{therapistRetailAOV.toLocaleString()} KZT</span>
                      </div>
                      <input 
                        type="range" 
                        min="25000" 
                        max="60000" 
                        step="5000"
                        value={therapistRetailAOV}
                        onChange={(e) => setTherapistRetailAOV(Number(e.target.value))}
                        className="w-full accent-gold-500 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                      />
                    </div>

                    {/* Input: Retail share rate commission */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Комиссия мастера от продаж косметики:</span>
                        <span className="text-gold-700 font-bold">{therapistRetailComm}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="20" 
                        value={therapistRetailComm}
                        onChange={(e) => setTherapistRetailComm(Number(e.target.value))}
                        className="w-full accent-gold-500 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                      />
                    </div>

                  </div>

                  {/* Calculated outputs for Master */}
                  <div className="rounded-xl bg-gold-50 p-4 border border-gold-200 space-y-3.5 text-xs text-neutral-800">
                    <div className="flex justify-between">
                      <span>Базовый оклад мастера:</span>
                      <span className="font-bold">{therapistCalculatedCommission.baseTreatmentEarnings.toLocaleString()} KZT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Количество проданных баночек (ритейл):</span>
                      <span className="font-bold text-neutral-900">{therapistCalculatedCommission.retailSalesCount} шт / мес</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Общий объем продаж ритейла:</span>
                      <span className="font-bold text-neutral-900">{therapistCalculatedCommission.totalRetailVolume.toLocaleString()} KZT</span>
                    </div>
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Премия за допродажи косметики ({therapistRetailComm}%):</span>
                      <span className="font-bold">+{therapistCalculatedCommission.retailCommissionEarnings.toLocaleString()} KZT</span>
                    </div>
                    
                    <div className="border-t border-gold-200/60 pt-3 flex justify-between text-sm font-bold text-neutral-900">
                      <span>Итого доход мастера в месяц:</span>
                      <span className="text-gold-800">{therapistCalculatedCommission.totalTherapistEarnings.toLocaleString()} KZT</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-400 leading-normal block">
                    *Пример показывает, что рекомендация домашней линии ухода La Sultane de Saba позволяет мастеру увеличить ЗП более чем на 30–50% без увеличения физической нагрузки на руки, стимулируя нативный промоушн на кушетке!
                  </span>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>

      {/* Footer block */}
      <footer className="mt-20 border-t border-gold-200 bg-white py-8 text-center text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© 2026 Rixos Water World Aktau & Anjana SPA. Все права защищены.</p>
          <p className="font-medium text-neutral-500">Разработчик: Alexandr Kharchenko® 2026</p>
          <p>Специализированная стратегическая разработка антикризисных решений для низкого («зимнего») сезона.</p>
          <p className="text-[10px] text-gold-600/60">Powered by French Premium Cosmetics La Sultane de Saba Paris</p>
        </div>
      </footer>

    </div>
  );
}
