import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

/**
 * items: [{ Icon?: Component, emoji?: string, name, desc, color, badge?: string, onOpen?: (name)=>void }]
 */
export default function ModuleSwiper({ items }) {
  return (
    <div className="ms-wrap">
      <Swiper
        modules={[EffectCoverflow, Autoplay, Keyboard, A11y]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        spaceBetween={12}
        breakpoints={{
          0:    { slidesPerView: 1.3 },
          480:  { slidesPerView: 1.8 },
          768:  { slidesPerView: 2.4 },
          1024: { slidesPerView: 3.2 },
          1440: { slidesPerView: 3.8 },
        }}
        speed={5200}
        loopAdditionalSlides={2}
        observer
        observeParents
        watchSlidesProgress
        keyboard={{ enabled: true }}
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
        coverflowEffect={{ rotate: 36, stretch: 0, depth: 200, modifier: 1, slideShadows: false }}
        className="ms-swiper"
      >
        {items.map((it) => {
          const Icon = it.Icon;
          return (
            <SwiperSlide key={it.name} className="ms-slide">
              <div
                className={`ms-card${it.onOpen ? ' ms-clickable' : ''}`}
                style={{ ['--accent']: it.color }}
                onClick={it.onOpen ? () => it.onOpen(it.name) : undefined}
                role={it.onOpen ? 'button' : undefined}
                tabIndex={it.onOpen ? 0 : undefined}
                onKeyDown={it.onOpen ? (e) => { if (e.key === 'Enter') it.onOpen(it.name); } : undefined}
              >
                <div className="ms-bar" style={{ background: `linear-gradient(90deg, ${it.color}, transparent)` }} />
                <div className="ms-icon" style={{ background: `${it.color}16`, borderColor: `${it.color}33` }}>
                  {Icon ? <Icon size={24} color={it.color} strokeWidth={1.9} /> : it.emoji ? <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{it.emoji}</span> : null}
                </div>
                <div className="ms-name">
                  {it.name}
                  {it.badge && <span className="ms-badge">{it.badge}</span>}
                </div>
                <p className="ms-desc">{it.desc}</p>
                {it.onOpen && <div className="ms-open" style={{ color: it.color }}>Open →</div>}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
        .ms-wrap { width: 100%; --swiper-theme-color: #2354F4; }
        /* explicit container height — without it Swiper's height:100% chain collapses to 0 */
        .ms-swiper { height: clamp(258px, 64vw, 286px); box-sizing: border-box; padding: 1.1rem 0 1.25rem; overflow: hidden; }
        /* constant-speed continuous flow — linear timing on BOTH the track and each slide so the
           coverflow rotation interpolates at a steady rate and never jerks at the seam between
           one auto-advance and the next */
        .ms-swiper .swiper-wrapper,
        .ms-swiper .swiper-slide { transition-timing-function: linear !important; }
        /* cylinder arc: width is set responsively by slidesPerView; side cards recede + dim.
           transition-property must include transform — otherwise the coverflow rotateY snaps
           instantly instead of animating. Swiper sets the matching duration inline per move. */
        .ms-slide {
          height: 100%;
          opacity: 0.4;
          transition-property: transform, opacity;
        }
        .ms-slide.swiper-slide-active { opacity: 1; }

        .ms-card {
          position: relative; overflow: hidden;
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          border-radius: 20px; padding: 1.4rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 14px 44px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: border-color .5s ease, box-shadow .5s ease, transform .7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ms-clickable { cursor: pointer; }
        .swiper-slide-active .ms-card,
        .ms-card:hover {
          border-color: color-mix(in srgb, var(--accent) 50%, transparent);
          box-shadow: 0 26px 70px color-mix(in srgb, var(--accent) 24%, transparent), inset 0 1px 0 rgba(255,255,255,0.18);
        }
        /* centre card grows; sides stay smaller (set by coverflow depth) */
        .swiper-slide-active .ms-card { transform: scale(1.06); }
        .ms-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .ms-icon {
          width: 50px; height: 50px; border-radius: 14px; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.9rem;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .ms-name {
          font-weight: 800; font-size: 1.04rem; color: var(--text); line-height: 1.25;
          margin-bottom: 0.4rem; letter-spacing: -0.01em;
          display: flex; align-items: center; gap: 0.45rem;
        }
        .ms-badge {
          font-size: 0.55rem; font-weight: 800; letter-spacing: 0.06em;
          color: #7C3AED; background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.3);
          padding: 0.1rem 0.4rem; border-radius: 100px;
        }
        .ms-desc { font-size: 0.83rem; color: var(--text3); line-height: 1.55; margin: 0; }
        .ms-open { margin-top: auto; padding-top: 0.7rem; font-size: 0.8rem; font-weight: 700; }
      `}</style>
    </div>
  );
}
