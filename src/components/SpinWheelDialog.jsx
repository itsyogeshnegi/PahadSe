import { useEffect, useRef, useState } from "react";
import { Gift, Copy, Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SpinWheelDialog() {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [lastSpinDate, setLastSpinDate] = useState("");
  const [spinsCountToday, setSpinsCountToday] = useState(0);
  const [hasWonToday, setHasWonToday] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const prizes = [
    { text: "5% discount", code: "PAHADSE5", condition: "Orders above Rs. 120" },
    { text: "1 package free (order > 150)", code: "FREEPACK150", condition: "Orders above Rs. 150" },
    { text: "10% discount", code: "PAHADSE10", condition: "Orders above Rs. 150" },
    { text: "2 packs free (order > 250)", code: "FREEPACK250", condition: "Orders above Rs. 250" },
    { text: "Better luck next time", code: null, condition: null },
  ];

  // Load spin state from localStorage on dialog open or mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayString = new Date().toDateString();
      const savedDate = localStorage.getItem("pahadse_last_spin_date");
      
      let spinsCount = 0;
      let won = false;
      let savedPrize = null;

      if (savedDate === todayString) {
        spinsCount = parseInt(localStorage.getItem("pahadse_spins_count_today") || "0", 10);
        won = localStorage.getItem("pahadse_has_won_today") === "true";
        const savedPrizeStr = localStorage.getItem("pahadse_last_spin_prize");
        if (savedPrizeStr) savedPrize = JSON.parse(savedPrizeStr);
      } else {
        // Reset for a new day
        localStorage.setItem("pahadse_last_spin_date", todayString);
        localStorage.setItem("pahadse_spins_count_today", "0");
        localStorage.setItem("pahadse_has_won_today", "false");
        localStorage.removeItem("pahadse_last_spin_prize");
      }

      setLastSpinDate(todayString);
      setSpinsCountToday(spinsCount);
      setHasWonToday(won);
      setPrize(savedPrize);
    }
  }, [open]);

  // Redraw the wheel canvas whenever the modal opens
  useEffect(() => {
    if (open) {
      setTimeout(drawWheel, 100);
    }
  }, [open]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = width / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    // Color theme matching PahadSe brand (greens, golds, creams)
    const sectorColors = ["#2d4a36", "#d4af37", "#1e3325", "#b8901c", "#f6f9f7"];
    const textColors = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#2d4a36"];
    const labels = ["5% OFF", "1 Free Pack", "10% OFF", "2 Free Packs", "Try Again"];

    for (let i = 0; i < 5; i++) {
      const startAngle = (i * 72 * Math.PI) / 180;
      const endAngle = ((i + 1) * 72 * Math.PI) / 180;

      // Draw sector slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sectorColors[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw text along sector radial line
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + (36 * Math.PI) / 180);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColors[i];
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(labels[i], radius - 15, 0);
      ctx.restore();
    }

    // Outer border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center pin
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#2d4a36";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const handleSpin = () => {
    if (spinning || spinsCountToday >= 3) return;

    const nextSpinCount = spinsCountToday + 1;
    setSpinning(true);
    setPrize(null);

    // Probability Weights:
    // - Index 4 is "Better luck next time" (Try Again) -> 40% probability
    // - Index 0, 1, 2, 3 are prizes -> 15% probability each (total 60%)
    // - One reward per day maximum (subsequent spins forced to Try Again),
    //   with a 1% easter egg chance of getting a second reward in one day.
    // - 3rd spin guaranteed win if they haven't won anything yet.
    let selectedIndex = 4;

    if (hasWonToday) {
      const luckyDoubleChance = Math.random() < 0.01; // 1% chance to get another reward
      if (luckyDoubleChance) {
        // Roll normally for prizes
        const r = Math.random();
        if (r < 0.15) selectedIndex = 0;
        else if (r < 0.30) selectedIndex = 1;
        else if (r < 0.45) selectedIndex = 2;
        else if (r < 0.60) selectedIndex = 3;
        else selectedIndex = 4;
      } else {
        // Force Try Again
        selectedIndex = 4;
      }
    } else {
      if (nextSpinCount === 3) {
        // Guaranteed win on 3rd spin: force selection from prizes 0-3 (25% chance each)
        selectedIndex = Math.floor(Math.random() * 4);
      } else {
        const r = Math.random();
        if (r < 0.15) {
          selectedIndex = 0;
        } else if (r < 0.30) {
          selectedIndex = 1;
        } else if (r < 0.45) {
          selectedIndex = 2;
        } else if (r < 0.60) {
          selectedIndex = 3;
        } else {
          selectedIndex = 4;
        }
      }
    }

    const centers = [36, 108, 180, 252, 324];
    const targetCenter = centers[selectedIndex];

    // Compute target angle relative to current rotation to make the animation clean
    const targetAngle = rotation + 1800 + (270 - targetCenter) - (rotation % 360);
    setRotation(targetAngle);

    setTimeout(() => {
      const selectedPrize = prizes[selectedIndex];
      const todayString = new Date().toDateString();
      const isWin = selectedPrize.code !== null;
      const updatedHasWon = hasWonToday || isWin;

      setPrize(selectedPrize);
      setSpinsCountToday(nextSpinCount);
      setHasWonToday(updatedHasWon);
      setSpinning(false);

      localStorage.setItem("pahadse_spins_count_today", String(nextSpinCount));
      localStorage.setItem("pahadse_has_won_today", String(updatedHasWon));
      
      if (isWin) {
        localStorage.setItem("pahadse_last_spin_prize", JSON.stringify(selectedPrize));
        startConfetti();
      }
    }, 4000); // match CSS duration
  };

  // Particles animation logic (falling flowers & stars)
  const startConfetti = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const colors = ["#2d4a36", "#d4af37", "#f6f9f7", "#e3342f", "#38c172", "#3490dc"];

    // Populate particles
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        vx: Math.random() * 3 - 1.5,
        vy: Math.random() * 3 + 2.2,
        size: Math.random() * 6 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        type: Math.random() > 0.5 ? "star" : "flower",
      });
    }

    const drawStar = (c, x, y, size, color) => {
      let rot = (Math.PI / 2) * 3;
      let step = Math.PI / 5;
      c.beginPath();
      c.moveTo(x, y - size);
      for (let i = 0; i < 5; i++) {
        c.lineTo(x + Math.cos(rot) * size, y + Math.sin(rot) * size);
        rot += step;
        c.lineTo(x + Math.cos(rot) * (size / 2), y + Math.sin(rot) * (size / 2));
        rot += step;
      }
      c.closePath();
      c.fillStyle = color;
      c.fill();
    };

    const drawFlower = (c, x, y, size, color) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        const px = x + Math.cos(angle) * (size * 0.5);
        const py = y + Math.sin(angle) * (size * 0.5);
        c.arc(px, py, size * 0.35, 0, 2 * Math.PI);
      }
      c.fillStyle = color;
      c.fill();
      
      // Center circle
      c.beginPath();
      c.arc(x, y, size * 0.2, 0, 2 * Math.PI);
      c.fillStyle = "#ffffff";
      c.fill();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      let active = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y < height) {
          active = true;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        if (p.type === "star") {
          drawStar(ctx, 0, 0, p.size, p.color);
        } else {
          drawFlower(ctx, 0, 0, p.size, p.color);
        }
        ctx.restore();
      });

      if (active) {
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    update();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleCopyCode = () => {
    if (!prize || !prize.code) return;
    navigator.clipboard.writeText(prize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOutOfSpins = spinsCountToday >= 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 p-0 shadow-xl bg-gold hover:bg-gold/90 text-gold-foreground border-2 border-background cursor-pointer select-none animate-bounce"
          aria-label="Spin the Wheel"
        >
          <Gift className="size-6 animate-pulse" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm bg-background border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col items-center">
        <DialogHeader className="text-center w-full">
          <DialogTitle className="text-2xl font-display text-primary font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="size-5 text-gold fill-gold" />
            Spin & Win
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Try your luck today to win Himalayan gift coupons!
          </DialogDescription>
        </DialogHeader>

        {/* Play Space */}
        <div className="relative w-full flex flex-col items-center my-6">
          <canvas
            ref={particleCanvasRef}
            className="absolute inset-0 z-20 pointer-events-none w-full h-full"
          />

          {/* Wheel Frame */}
          <div className="relative size-[250px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-background flex items-center justify-center p-2 border border-border/40 select-none">
            {/* Top Indicator Arrow */}
            <div className="absolute -top-3 left-[calc(50%-10px)] z-30 size-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold filter drop-shadow-sm" />

            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)"
                  : "none",
              }}
              className="rounded-full w-full h-full"
            />
          </div>
        </div>

        {/* Spin Actions & Result Display */}
        <div className="w-full text-center space-y-4">
          {prize ? (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/40 space-y-2 animate-in fade-in">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block">
                Result
              </span>
              <p className="text-lg font-bold text-primary font-display">{prize.text}</p>
              
              {prize.code ? (
                <>
                  <div className="flex items-center gap-2 mt-3 bg-background border border-border/80 rounded-lg p-2 max-w-[240px] mx-auto">
                    <span className="text-sm font-mono font-bold text-foreground flex-1 select-all">
                      {prize.code}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyCode}
                      className="h-8 w-8 p-0 hover:bg-secondary cursor-pointer"
                    >
                      {copied ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Copy className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {prize.condition && (
                    <span className="text-[11px] font-semibold text-primary block mt-1 animate-pulse">
                      ({prize.condition})
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  {isOutOfSpins 
                    ? "No spins left for today! Return tomorrow for another chance." 
                    : `Try again! You have ${3 - spinsCountToday} attempts remaining.`
                  }
                </p>
              )}
              {prize.code && (
                <span className="text-[10px] text-muted-foreground block mt-1.5 leading-tight">
                  Copy code and paste it on WhatsApp checkout to redeem.
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground leading-normal">
              You get **3 free spins** per day and are **guaranteed** to win a prize!
            </p>
          )}

          <div className="space-y-2">
            <Button
              size="lg"
              onClick={handleSpin}
              disabled={spinning || isOutOfSpins}
              className="w-full font-semibold cursor-pointer shadow-sm animate-pulse hover:animate-none"
            >
              {spinning 
                ? "Spinning..." 
                : isOutOfSpins 
                  ? "Already Spun 3 Times Today" 
                  : `Spin Now (${3 - spinsCountToday} Left)`
              }
            </Button>
            
            <span className="text-[10px] text-muted-foreground block">
              Spins used today: {spinsCountToday} / 3
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
