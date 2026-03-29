import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --purple: #A78BFA;
    --purple-dark: #7C3AED;
    --blue: #7DD3FC;
    --pink: #F9A8D4;
    --coral: #FB7185;
    --bg: #FAFAF8;
    --bg2: #F3F0FF;
    --text: #1A1523;
    --muted: #6B6483;
    --card: #FFFFFF;
    --radius: 20px;
    --radius-lg: 32px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: 'Syne', sans-serif;
    line-height: 1.1;
  }

  /* ---- NOISE OVERLAY ---- */
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ---- NAV ---- */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 5%;
    background: rgba(250,250,248,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(167,139,250,0.12);
    transition: box-shadow 0.3s;
  }
  nav.scrolled { box-shadow: 0 4px 30px rgba(124,58,237,0.08); }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.4rem;
    background: linear-gradient(135deg, var(--purple-dark), var(--coral));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }
  .nav-cta {
    background: var(--purple-dark);
    color: #fff; border: none; cursor: pointer;
    padding: 10px 22px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.9rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }

  /* ---- HERO ---- */
  .hero {
    min-height: 100vh;
    padding: 120px 5% 80px;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(167,139,250,0.18) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 90% 80%, rgba(249,168,212,0.12) 0%, transparent 60%),
                var(--bg);
    position: relative;
    overflow: hidden;
  }

  .hero-blob {
    position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  }
  .blob1 { width: 500px; height: 500px; background: rgba(167,139,250,0.15); top: -100px; left: -100px; animation: float1 8s ease-in-out infinite; }
  .blob2 { width: 400px; height: 400px; background: rgba(249,168,212,0.12); bottom: -80px; right: -80px; animation: float2 10s ease-in-out infinite; }
  .blob3 { width: 300px; height: 300px; background: rgba(125,211,252,0.1); top: 40%; left: 30%; animation: float1 12s ease-in-out infinite reverse; }

  @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(1.08)} }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(167,139,250,0.12);
    border: 1px solid rgba(167,139,250,0.3);
    color: var(--purple-dark);
    padding: 8px 16px; border-radius: 50px;
    font-size: 0.85rem; font-weight: 500;
    margin-bottom: 28px;
    animation: fadeUp 0.8s ease both;
  }
  .badge-dot { width: 7px; height: 7px; background: var(--purple); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .hero h1 {
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 800; letter-spacing: -2px;
    max-width: 800px;
    animation: fadeUp 0.8s 0.1s ease both;
    line-height: 1.05;
  }
  .hero h1 span {
    background: linear-gradient(135deg, var(--purple-dark) 0%, var(--coral) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-sub {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--muted); max-width: 480px;
    margin: 20px auto 0; font-weight: 300;
    line-height: 1.7;
    animation: fadeUp 0.8s 0.2s ease both;
  }
  .hero-actions {
    display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
    margin-top: 40px;
    animation: fadeUp 0.8s 0.3s ease both;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--purple-dark), #6D28D9);
    color: #fff; border: none; cursor: pointer;
    padding: 16px 36px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 8px 30px rgba(124,58,237,0.35);
    position: relative; overflow: hidden;
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(124,58,237,0.45); }
  .btn-primary:hover::after { opacity: 1; }

  .btn-ghost {
    background: transparent; border: 1.5px solid rgba(167,139,250,0.4);
    color: var(--purple-dark); cursor: pointer;
    padding: 16px 28px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .btn-ghost:hover { background: rgba(167,139,250,0.08); border-color: var(--purple); }

  .hero-price-note {
    margin-top: 16px; font-size: 0.82rem; color: var(--muted);
    animation: fadeUp 0.8s 0.4s ease both;
  }
  .hero-price-note strong { color: var(--purple-dark); }

  /* Couple visual */
  .hero-visual {
    margin-top: 60px;
    width: 100%; max-width: 700px;
    background: linear-gradient(145deg, rgba(167,139,250,0.1), rgba(249,168,212,0.08));
    border: 1px solid rgba(167,139,250,0.2);
    border-radius: var(--radius-lg);
    padding: 40px;
    display: flex; gap: 20px; align-items: center; justify-content: center;
    animation: fadeUp 0.8s 0.5s ease both;
    position: relative;
  }
  .avatar-pair { display: flex; gap: -10px; position: relative; }
  .avatar {
    width: 90px; height: 90px; border-radius: 50%;
    border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.2rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  .avatar:last-child { margin-left: -20px; }
  .av1 { background: linear-gradient(135deg, #E9D5FF, #C4B5FD); }
  .av2 { background: linear-gradient(135deg, #FDE68A, #FCA5A5); }

  .hero-stat-row {
    display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;
    margin-top: 40px;
    animation: fadeUp 0.8s 0.6s ease both;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--purple-dark); }
  .hero-stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  /* ---- SECTION COMMON ---- */
  section { padding: 80px 5%; }
  .section-tag {
    display: inline-block;
    background: rgba(167,139,250,0.12);
    color: var(--purple-dark);
    font-size: 0.78rem; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 6px 14px; border-radius: 50px;
    margin-bottom: 18px;
  }
  .section-title {
    font-size: clamp(2rem, 4.5vw, 3rem);
    font-weight: 800; letter-spacing: -1px; max-width: 600px;
  }
  .section-title span { color: var(--purple-dark); }
  .section-sub { color: var(--muted); font-size: 1.05rem; margin-top: 14px; max-width: 500px; font-weight: 300; line-height: 1.7; }

  /* ---- PROBLEM ---- */
  .problem-section {
    background: linear-gradient(150deg, #1A1523 0%, #2D1F3D 100%);
    color: #fff; border-radius: var(--radius-lg);
    margin: 0 3%;
    position: relative; overflow: hidden;
  }
  .problem-section .section-tag { background: rgba(249,168,212,0.15); color: var(--pink); }
  .problem-section .section-title { color: #fff; }
  .problem-section .section-sub { color: rgba(255,255,255,0.6); }

  .problem-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 44px;
  }
  .problem-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius);
    padding: 28px;
    transition: transform 0.25s, background 0.25s;
    cursor: default;
  }
  .problem-card:hover { transform: translateY(-4px); background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.3); }
  .problem-card:first-child { grid-column: 1 / -1; }
  .problem-icon { font-size: 2rem; margin-bottom: 12px; }
  .problem-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; }
  .problem-card p { font-size: 0.88rem; color: rgba(255,255,255,0.55); line-height: 1.6; }

  .problem-bg-circle {
    position: absolute; width: 400px; height: 400px;
    border-radius: 50%; right: -100px; top: -100px;
    background: radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%);
    pointer-events: none;
  }

  /* ---- SOLUTION ---- */
  .solution-section { text-align: center; }
  .solution-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px; margin-top: 48px; max-width: 900px; margin-left: auto; margin-right: auto;
  }
  .solution-card {
    background: #fff;
    border: 1px solid rgba(167,139,250,0.15);
    border-radius: var(--radius);
    padding: 32px 24px;
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    position: relative; overflow: hidden;
  }
  .solution-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(167,139,250,0.05), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .solution-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(167,139,250,0.15); border-color: rgba(167,139,250,0.4); }
  .solution-card:hover::before { opacity: 1; }
  .sol-icon {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin: 0 auto 18px;
  }
  .sol-i1 { background: linear-gradient(135deg, #EDE9FE, #DDD6FE); }
  .sol-i2 { background: linear-gradient(135deg, #E0F2FE, #BAE6FD); }
  .sol-i3 { background: linear-gradient(135deg, #FCE7F3, #FBCFE8); }
  .sol-i4 { background: linear-gradient(135deg, #D1FAE5, #A7F3D0); }
  .solution-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
  .solution-card p { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }

  /* ---- HOW IT WORKS ---- */
  .how-section {
    background: linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(249,168,212,0.05) 100%);
    border-radius: var(--radius-lg); margin: 0 3%;
  }
  .how-steps {
    display: flex; gap: 0; margin-top: 52px;
    align-items: flex-start; justify-content: center;
    flex-wrap: wrap;
  }
  .how-step { flex: 1; min-width: 200px; text-align: center; padding: 20px; position: relative; }
  .how-step:not(:last-child)::after {
    content: ''; position: absolute; top: 42px; right: -20px;
    width: 40px; height: 2px;
    background: linear-gradient(90deg, var(--purple), var(--pink));
    border-radius: 2px;
  }
  .step-num {
    width: 80px; height: 80px; border-radius: 24px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-size: 2rem;
    position: relative;
  }
  .sn1 { background: linear-gradient(135deg, #7C3AED, #A78BFA); box-shadow: 0 12px 30px rgba(124,58,237,0.3); }
  .sn2 { background: linear-gradient(135deg, #0EA5E9, #7DD3FC); box-shadow: 0 12px 30px rgba(14,165,233,0.3); }
  .sn3 { background: linear-gradient(135deg, #EC4899, #F9A8D4); box-shadow: 0 12px 30px rgba(236,72,153,0.3); }
  .step-label {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 10px;
  }
  .step-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.65; }

  /* ---- TRUST ---- */
  .trust-section { text-align: center; }
  .counselors-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px; margin-top: 48px; max-width: 860px; margin-left: auto; margin-right: auto;
  }
  .counselor-card {
    background: #fff; border: 1px solid rgba(167,139,250,0.15);
    border-radius: var(--radius); padding: 28px 24px;
    text-align: left;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .counselor-card:hover { transform: translateY(-4px); box-shadow: 0 16px 44px rgba(167,139,250,0.15); }
  .counselor-avatar {
    width: 64px; height: 64px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin-bottom: 16px;
  }
  .ca1 { background: linear-gradient(135deg, #EDE9FE, #C4B5FD); }
  .ca2 { background: linear-gradient(135deg, #FEF3C7, #FDE68A); }
  .ca3 { background: linear-gradient(135deg, #CCFBF1, #99F6E4); }
  .counselor-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
  .counselor-cred { font-size: 0.78rem; color: var(--purple-dark); font-weight: 500; margin: 4px 0 10px; }
  .counselor-bio { font-size: 0.83rem; color: var(--muted); line-height: 1.6; }
  .stars { color: #FCD34D; font-size: 0.85rem; margin-top: 12px; }

  .testimonials { margin-top: 60px; }
  .testi-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; margin-top: 28px;
  }
  .testi-card {
    background: #fff; border-radius: var(--radius);
    padding: 28px; border: 1px solid rgba(167,139,250,0.12);
    text-align: left; position: relative; overflow: hidden;
  }
  .testi-card::before {
    content: '"'; position: absolute; top: -10px; right: 16px;
    font-size: 7rem; color: rgba(167,139,250,0.08);
    font-family: 'Syne', sans-serif; font-weight: 800; line-height: 1;
    pointer-events: none;
  }
  .testi-text { font-size: 0.9rem; color: var(--text); line-height: 1.7; margin-bottom: 18px; }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .testi-av {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .ta1 { background: linear-gradient(135deg, #EDE9FE, #C4B5FD); }
  .ta2 { background: linear-gradient(135deg, #FEF3C7, #FDE68A); }
  .ta3 { background: linear-gradient(135deg, #FCE7F3, #FBCFE8); }
  .testi-name { font-size: 0.85rem; font-weight: 600; }
  .testi-loc { font-size: 0.75rem; color: var(--muted); }

  .trust-badges {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    margin-top: 48px;
  }
  .trust-badge {
    display: flex; align-items: center; gap: 10px;
    background: rgba(167,139,250,0.07);
    border: 1px solid rgba(167,139,250,0.2);
    border-radius: 50px; padding: 10px 20px;
    font-size: 0.82rem; font-weight: 500; color: var(--purple-dark);
  }

  /* ---- PRICING ---- */
  .pricing-section { text-align: center; }
  .pricing-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px; margin-top: 48px; max-width: 640px; margin-left: auto; margin-right: auto;
  }
  .pricing-card {
    border-radius: var(--radius-lg); padding: 36px 30px;
    text-align: left; position: relative; overflow: hidden;
    transition: transform 0.25s;
  }
  .pricing-card:hover { transform: translateY(-6px); }
  .pc-trial {
    background: #fff; border: 2px solid rgba(167,139,250,0.3);
  }
  .pc-regular {
    background: linear-gradient(145deg, #7C3AED, #5B21B6);
    color: #fff;
  }
  .pricing-label {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 20px;
    display: inline-block; padding: 5px 12px; border-radius: 50px;
  }
  .pl-trial { background: rgba(167,139,250,0.1); color: var(--purple-dark); }
  .pl-regular { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
  .pricing-price {
    font-family: 'Syne', sans-serif; font-size: 3.2rem; font-weight: 800;
    letter-spacing: -2px; line-height: 1;
  }
  .pc-trial .pricing-price { color: var(--text); }
  .pc-regular .pricing-price { color: #fff; }
  .pricing-per { font-size: 0.85rem; color: var(--muted); margin-top: 4px; }
  .pc-regular .pricing-per { color: rgba(255,255,255,0.65); }
  .pricing-desc { margin-top: 20px; font-size: 0.88rem; line-height: 1.7; }
  .pc-trial .pricing-desc { color: var(--muted); }
  .pc-regular .pricing-desc { color: rgba(255,255,255,0.8); }
  .pricing-features { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
  .pricing-features li {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.85rem; list-style: none;
  }
  .pc-trial .pricing-features li { color: var(--text); }
  .pc-regular .pricing-features li { color: rgba(255,255,255,0.85); }
  .check { font-size: 1rem; }
  .btn-pricing-trial {
    margin-top: 28px; width: 100%;
    background: linear-gradient(135deg, var(--purple-dark), #6D28D9);
    color: #fff; border: none; cursor: pointer;
    padding: 14px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    box-shadow: 0 8px 24px rgba(124,58,237,0.3);
    transition: transform 0.2s;
  }
  .btn-pricing-trial:hover { transform: translateY(-2px); }
  .btn-pricing-regular {
    margin-top: 28px; width: 100%;
    background: rgba(255,255,255,0.15);
    color: #fff; border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer;
    padding: 14px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    transition: background 0.2s;
  }
  .btn-pricing-regular:hover { background: rgba(255,255,255,0.25); }
  .popular-badge {
    position: absolute; top: 20px; right: 20px;
    background: var(--pink); color: var(--text);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px;
    padding: 5px 12px; border-radius: 50px;
  }

  /* ---- FINAL CTA ---- */
  .final-cta {
    text-align: center; padding: 100px 5%;
    background: linear-gradient(145deg, #1A1523, #2D1F3D, #1A1523);
    border-radius: var(--radius-lg); margin: 0 3% 80px;
    position: relative; overflow: hidden;
  }
  .final-cta-glow {
    position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    pointer-events: none;
  }
  .final-cta h2 {
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    color: #fff; font-weight: 800; letter-spacing: -1.5px;
    max-width: 600px; margin: 0 auto;
    position: relative; z-index: 1;
  }
  .final-cta p {
    color: rgba(255,255,255,0.6); margin-top: 18px; font-size: 1.05rem;
    position: relative; z-index: 1;
  }
  .final-cta-actions {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    margin-top: 40px; position: relative; z-index: 1;
  }
  .btn-cta-main {
    background: linear-gradient(135deg, var(--coral), #F43F5E);
    color: #fff; border: none; cursor: pointer;
    padding: 18px 42px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 700;
    box-shadow: 0 12px 36px rgba(251,113,133,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-cta-main:hover { transform: translateY(-3px); box-shadow: 0 18px 48px rgba(251,113,133,0.5); }

  .btn-wa {
    background: #25D366; color: #fff; border: none; cursor: pointer;
    padding: 18px 32px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    transition: transform 0.2s;
  }
  .btn-wa:hover { transform: translateY(-2px); }

  /* ---- FOOTER ---- */
  footer {
    text-align: center; padding: 30px 5%;
    font-size: 0.8rem; color: var(--muted);
    border-top: 1px solid rgba(167,139,250,0.1);
  }
  footer span { color: var(--purple-dark); font-weight: 600; }

  /* ---- STICKY MOBILE CTA ---- */
  .sticky-cta {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
    padding: 16px 20px;
    background: rgba(250,250,248,0.95); backdrop-filter: blur(16px);
    border-top: 1px solid rgba(167,139,250,0.15);
    display: none;
  }
  .sticky-cta button {
    width: 100%; background: linear-gradient(135deg, var(--purple-dark), #6D28D9);
    color: #fff; border: none; cursor: pointer;
    padding: 16px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
    box-shadow: 0 8px 24px rgba(124,58,237,0.3);
  }

  @media (max-width: 768px) {
    .sticky-cta { display: block; }
    .problem-grid { grid-template-columns: 1fr; }
    .problem-card:first-child { grid-column: auto; }
    .how-step:not(:last-child)::after { display: none; }
    nav .nav-cta { display: none; }
    .hero { padding-top: 100px; }
    body { padding-bottom: 80px; }
  }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;

// Data
const problems = [
  { icon: "💬", title: "Overthinking every message?", desc: "You re-read texts 10 times wondering what they actually meant." },
  { icon: "🔥", title: "Fighting over small things?", desc: "Arguments that start nowhere and spiral into something bigger." },
  { icon: "❓", title: "Not sure if this will last?", desc: "That quiet fear in the back of your mind about where this is going." },
  { icon: "🤐", title: "Struggling to communicate?", desc: "You feel something but can't find the right words to say it." },
];

const solutions = [
  { icon: "🎥", cls: "sol-i1", title: "Private video sessions", desc: "One-on-one from anywhere — your room, your pace." },
  { icon: "🎓", cls: "sol-i2", title: "Certified counselors", desc: "Real credentials, real experience with young couples." },
  { icon: "🔒", cls: "sol-i3", title: "100% confidential", desc: "Your conversations never leave the session. Ever." },
  { icon: "⚡", cls: "sol-i4", title: "Same-day booking", desc: "No waitlists. Get a session today, not next month." },
];

const steps = [
  { icon: "📅", cls: "sn1", label: "Book a session", desc: "Pick a counselor and a time that works for you. Takes under 2 minutes." },
  { icon: "📱", cls: "sn2", label: "Join video call", desc: "Secure, private video call — no downloads needed, just a link." },
  { icon: "💡", cls: "sn3", label: "Talk & get clarity", desc: "Work through feelings, patterns, and next steps with a real pro." },
];

const counselors = [
  { av: "👩", cls: "ca1", name: "Dr. Priya Sharma", cred: "M.Phil Clinical Psychology | 6 yrs exp", bio: "Specializes in attachment issues and communication in young couples. Known for her non-judgmental, warm approach.", stars: "★★★★★ (4.9)" },
  { av: "🧑", cls: "ca2", name: "Arjun Mehta", cred: "MSc Counselling Psychology | 4 yrs exp", bio: "Works with couples navigating trust, long-distance, and identity challenges in modern relationships.", stars: "★★★★★ (4.8)" },
  { av: "👩", cls: "ca3", name: "Sneha Nair", cred: "MA Psychology | CBT Certified | 5 yrs exp", bio: "Expert in emotional regulation and breaking unhealthy relationship cycles for Gen Z couples.", stars: "★★★★★ (4.9)" },
];

const testimonials = [
  { av: "😊", cls: "ta1", text: "We were fighting every single day. After two sessions, I finally understood why we kept hitting the same wall. Honestly didn't think this would help but it genuinely did.", name: "Arya & Rohan", loc: "Mumbai, 24 & 25" },
  { av: "🙂", cls: "ta2", text: "I was hesitant because I thought it would be awkward or too formal. It was the opposite — felt like talking to someone who actually got us. ₹199 for the first session was a no-brainer.", name: "Simran K.", loc: "Delhi, 22" },
  { av: "😌", cls: "ta3", text: "Long distance was tearing us apart. MHelth gave us actual tools to handle it, not just generic advice. We're in a completely different place now.", name: "Kunal & Divya", loc: "Bangalore, 26 & 23" },
];

export default function MHelth() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    return () => {
      document.head.removeChild(styleEl);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="noise" />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        {/* <div className="nav-logo">MHelth</div> */}
        <img src="public\WhatsApp Image 2026-03-29 at 2.48.19 PM.jpeg" alt="" className="nav-logo" style={{ width: "50px" }} />
        <button className="nav-cta" onClick={() => {
          document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })
          navigate("/form")

        }}>
          Book Session →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-blob blob1" />
        <div className="hero-blob blob2" />
        <div className="hero-blob blob3" />

        <div className="hero-badge">
          <span className="badge-dot" />
          Trusted by 8,000+ young couples across India
        </div>


        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div>
            <h1>Fix your relationship<br /><span>before it breaks.</span></h1>
            <p className="hero-sub">Talk to certified counselors privately on video. No judgment, no awkwardness — just clarity.</p>
          </div>

          <div>
            <img src="public\WhatsApp Image 2026-03-29 at 2.57.43 PM.jpeg" alt="" style={{width:"500px"}} />
          </div>
        </div>



        <div className="hero-actions">
          <button className="btn-primary" onClick={() => {
            document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })
            navigate("/form")
          }}>
            Book Your First Session ✨
          </button>
          <button className="btn-ghost" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>
            <span>▶</span> See how it works
          </button>
        </div>


        <div className="hero-visual">
          <div className="avatar-pair">
            <div className="avatar av1">🙍‍♀️</div>
            <div className="avatar av2">🙍‍♂️</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>You're not broken.</div>
            <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: 6 }}>You just need the right space to figure it out together.</div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Same-day sessions", "Confidential", "From ₹199"].map(t => (
                <span key={t} style={{ background: "rgba(167,139,250,0.1)", color: "var(--purple-dark)", fontSize: "0.75rem", fontWeight: 600, padding: "5px 12px", borderRadius: "50px" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-stat-row">
          {[["8,000+", "Couples helped"], ["98%", "Say they'd recommend"], ["4.9★", "Average counselor rating"], ["< 2 min", "To book a session"]].map(([n, l]) => (
            <div className="hero-stat" key={l}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section reveal">
        <div className="problem-bg-circle" />
        <span className="section-tag">Sound familiar?</span>
        <h2 className="section-title">Feeling stuck in your<br />relationship?</h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.55)" }}>
          Most couples go through this. The problem isn't your relationship — it's not having the right tools to work through it.
        </p>
        <div className="problem-grid">
          {problems.map((p) => (
            <div className="problem-card" key={p.title}>
              <div className="problem-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="solution-section reveal">
        <span className="section-tag">What we offer</span>
        <h2 className="section-title">We help you understand,<br /><span>not judge.</span></h2>
        <p className="section-sub" style={{ margin: "14px auto 0" }}>
          A safe, private space built for real couples dealing with real stuff.
        </p>
        <div className="solution-grid">
          {solutions.map((s) => (
            <div className="solution-card" key={s.title}>
              <div className={`sol-icon ${s.cls}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section reveal" id="how">
        <span className="section-tag">Simple process</span>
        <h2 className="section-title">3 steps to<br /><span>clearer skies.</span></h2>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div className="how-step" key={s.label}>
              <div className={`step-num ${s.cls}`}>{s.icon}</div>
              <div className="step-label">Step {i + 1} · {s.label}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="trust-section reveal">
        <span className="section-tag">Who you'll talk to</span>
        <h2 className="section-title">Real counselors.<br /><span>Real credentials.</span></h2>
        <p className="section-sub" style={{ margin: "14px auto 0" }}>
          Every counselor is verified, trained, and genuinely invested in your wellbeing.
        </p>
        <div className="counselors-grid">
          {counselors.map((c) => (
            <div className="counselor-card" key={c.name}>
              <div className={`counselor-avatar ${c.cls}`}>{c.av}</div>
              <div className="counselor-name">{c.name}</div>
              <div className="counselor-cred">{c.cred}</div>
              <p className="counselor-bio">{c.bio}</p>
              <div className="stars">{c.stars}</div>
            </div>
          ))}
        </div>

        <div className="testimonials reveal">
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800 }}>What couples are saying</h3>
          <div className="testi-grid">
            {testimonials.map((t) => (
              <div className="testi-card" key={t.name}>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className={`testi-av ${t.cls}`}>{t.av}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trust-badges">
          {[["🔒", "End-to-end encrypted sessions"], ["✅", "RCI-affiliated counselors"], ["🛡️", "Zero data sharing, ever"], ["⚡", "Available 7 days a week"]].map(([icon, text]) => (
            <div className="trust-badge" key={text}><span>{icon}</span> {text}</div>
          ))}
        </div>
      </section>

     
      

      {/* FINAL CTA */}
      <section className="final-cta reveal">
        <div className="final-cta-glow" />
        <h2>Talk to someone today.</h2>
        <p>You don't have to figure it all out alone. Help is one click away.</p>
        <div className="final-cta-actions">
          <button className="btn-cta-main" onClick={() => {
            document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })
            navigate("/form")
          }}>
            Book Now
          </button>
          <a href="https://wa.me/9046673200?text=Hi%2C%20I%20want%20to%20book%20a%20session%20on%20MHelth" target="_blank" rel="noopener noreferrer">
            <button className="btn-wa">
              <span>💬</span> Chat on WhatsApp
            </button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>MHelth</span>
        </div>
        <p>Relationship counseling for the generation that's figuring it out.</p>
        <p style={{ marginTop: 10 }}>© 2025 <span>MHelth</span> · Privacy Policy · Terms · support@mhelth.in</p>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta">
        <button onClick={() => document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })}>
          Book First Session
        </button>
      </div>
    </>
  );
}
