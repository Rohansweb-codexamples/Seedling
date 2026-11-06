import { useCallback, useState } from 'react';
import Scene from './components/Scene';
import Hud from './components/Hud';
import BottomNav from './components/BottomNav';
import Sheet from './components/Sheet';
import SeedsPanel from './components/SeedsPanel';
import BoostersPanel from './components/BoostersPanel';
import ShopPanel from './components/ShopPanel';
import SettingsSheet from './components/SettingsSheet';
import Toasts from './components/Toasts';
import { useGame } from './game/useGame';
import { PLANTS } from './game/plants';

const TITLES = { seeds: 'SEEDS', boosters: 'BOOSTERS', shop: 'SHOP' };

export default function App() {
  const game = useGame();
  const [tab, setTab] = useState(null);
  const [targetSlot, setTargetSlot] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handlePot = useCallback(
    (index) => {
      if (game.state.slots[index]) {
        game.tap(index);
        return;
      }
      setTargetSlot(index);
      setTab('seeds');
    },
    [game],
  );

  const handleTab = (id) => {
    setTab((current) => (current === id ? null : id));
    setTargetSlot(null);
  };

  const handlePlant = (plantId) => {
    game.plant(plantId, targetSlot);
    setTargetSlot(null);
  };

  const canAffordSomething = PLANTS.some(
    (plant) => game.state.level >= plant.unlockLevel && game.state.oxygen >= plant.cost,
  );

  const panel =
    tab === 'seeds' ? (
      <SeedsPanel
        slots={game.state.slots}
        upgrades={game.state.upgrades}
        level={game.state.level}
        oxygen={game.state.oxygen}
        emptySlots={game.emptySlots}
        now={game.now}
        onPlant={handlePlant}
        onUpgrade={game.upgrade}
      />
    ) : tab === 'boosters' ? (
      <BoostersPanel
        gems={game.state.gems}
        boostActive={game.boostActive}
        boostRemaining={game.boostRemaining}
        onActivate={game.activateBooster}
      />
    ) : tab === 'shop' ? (
      <ShopPanel
        upgrades={game.state.upgrades}
        oxygen={game.state.oxygen}
        onBuy={game.buyUpgrade}
      />
    ) : null;

  return (
    <div className="game">
      <div className="scene-layer">
        <Scene
          slots={game.state.slots}
          upgrades={game.state.upgrades}
          onPot={handlePot}
        />
      </div>
      <div className="scene-fade" />

      <Hud
        level={game.state.level}
        xp={game.state.xp}
        xpNeeded={game.xpNeeded}
        oxygen={game.state.oxygen}
        rate={game.rate}
        gems={game.state.gems}
        boostActive={game.boostActive}
        boostRemaining={game.boostRemaining}
        onOpenBoosters={() => handleTab('boosters')}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Toasts toasts={game.toasts} />

      {tab && panel && (
        <Sheet title={TITLES[tab]} onClose={() => setTab(null)}>
          {panel}
        </Sheet>
      )}

      {settingsOpen && (
        <SettingsSheet
          onClose={() => setSettingsOpen(false)}
          onReset={() => {
            game.reset();
            setSettingsOpen(false);
          }}
        />
      )}

      <BottomNav
        active={tab}
        onChange={handleTab}
        seedsBadge={canAffordSomething && game.emptySlots > 0 && tab !== 'seeds' ? 1 : 0}
      />
    </div>
  );
}
