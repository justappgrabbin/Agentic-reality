import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AgentReality } from '@/lib/core/agentReality'
import type { AgentEntity, RealityEvent, RealityStats } from '@/lib/core/agentReality'
import { CIRCUIT_GROUP_COLORS, CIRCUIT_GROUP_LABELS } from '@/lib/core/channelActivation'
import type { CircuitGroup } from '@/lib/core/channelActivation'

const EVENT_COLORS: Record<string, string> = {
  birth: 'text-green-400',
  death: 'text-red-400',
  reproduction: 'text-purple-400',
  channel_activation: 'text-cyan-400',
  morph: 'text-amber-400',
  communication: 'text-blue-400',
  signal: 'text-orange-400',
  gate_flip: 'text-pink-400',
  terraform: 'text-emerald-400',
  build: 'text-yellow-400',
}

export default function AgenticRealityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const realityRef = useRef<AgentReality | null>(null)
  const [agents, setAgents] = useState<AgentEntity[]>([])
  const [events, setEvents] = useState<RealityEvent[]>([])
  const [stats, setStats] = useState<RealityStats | null>(null)
  const [running, setRunning] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [spawnName, setSpawnName] = useState('')
  const [speed, setSpeed] = useState(100) // ms between steps
  const rafRef = useRef<number>(0)
  const lastStepRef = useRef<number>(0)

  // Initialize reality
  useEffect(() => {
    const reality = new AgentReality()
    realityRef.current = reality
    // Seed with 5 initial agents
    reality.spawnAgent('Alpha')
    reality.spawnAgent('Beta')
    reality.spawnAgent('Gamma')
    reality.spawnAgent('Delta')
    reality.spawnAgent('Epsilon')
    syncState()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const syncState = useCallback(() => {
    const reality = realityRef.current
    if (!reality) return
    const snapshot = reality.getSnapshot()
    setAgents(snapshot.agents)
    setEvents(snapshot.events)
    setStats(reality.getStats())
  }, [])

  // Simulation loop
  useEffect(() => {
    if (!running) return
    const loop = (ts: number) => {
      if (ts - lastStepRef.current > speed) {
        realityRef.current?.step()
        syncState()
        lastStepRef.current = ts
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, speed, syncState])

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const reality = realityRef.current
      if (!reality) return

      const cellW = canvas.width / 9
      const cellH = canvas.height / 9

      // Draw 81-field
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const idx = row * 9 + col
          const val = reality.substrate.field81.cells[idx]
          const x = col * cellW
          const y = row * cellH

          if (val === 1) {
            ctx.fillStyle = `rgba(80, 200, 120, 0.25)`
          } else if (val === 2) {
            ctx.fillStyle = `rgba(255, 120, 60, 0.25)`
          } else {
            ctx.fillStyle = `rgba(40, 30, 60, 0.15)`
          }
          ctx.fillRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1)
        }
      }

      // Grid lines
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 9; i++) {
        ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, canvas.height); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, i * cellH); ctx.lineTo(canvas.width, i * cellH); ctx.stroke()
      }

      // Magic square center highlight
      const cx = 4 * cellW + cellW / 2
      const cy = 4 * cellH + cellH / 2
      ctx.strokeStyle = 'rgba(200, 150, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(cellW, cellH) * 0.4, 0, Math.PI * 2)
      ctx.stroke()

      // Draw buildings
      for (const building of reality.substrate.buildings) {
        const row = Math.floor(building.position / 9)
        const col = building.position % 9
        const x = col * cellW + cellW / 2
        const y = row * cellH + cellH / 2
        const bColor = building.energySignature === 1 ? '#4ade80' : building.energySignature === 2 ? '#fb923c' : '#a78bfa'
        const size = Math.min(cellW, cellH) * 0.35
        ctx.fillStyle = bColor + '80'
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
        ctx.strokeStyle = bColor
        ctx.lineWidth = 1
        ctx.strokeRect(x - size / 2, y - size / 2, size, size)
      }

      // Draw signals
      for (const sig of reality.substrate.signals) {
        const fromRow = Math.floor(sig.fromPosition / 9)
        const fromCol = sig.fromPosition % 9
        const toRow = Math.floor(sig.toPosition / 9)
        const toCol = sig.toPosition % 9
        ctx.strokeStyle = sig.type === 'energy' ? 'rgba(255, 200, 100, 0.4)' : 'rgba(100, 200, 255, 0.3)'
        ctx.lineWidth = sig.amplitude * 2
        ctx.beginPath()
        ctx.moveTo(fromCol * cellW + cellW / 2, fromRow * cellH + cellH / 2)
        ctx.lineTo(toCol * cellW + cellW / 2, toRow * cellH + cellH / 2)
        ctx.stroke()
      }

      // Draw agents
      for (const entity of reality.agents.values()) {
        if (!entity.life.alive) continue
        const row = Math.floor(entity.life.position / 9)
        const col = entity.life.position % 9
        const x = col * cellW + cellW / 2
        const y = row * cellH + cellH / 2
        const radius = 3 + (entity.life.energy / 100) * 4

        // Circuit family color
        const color = entity.circuitFamily ? CIRCUIT_GROUP_COLORS[entity.circuitFamily as CircuitGroup] : '#9ca3af'
        const isSelected = entity.id === selectedAgentId

        // Glow for selected
        if (isSelected) {
          ctx.fillStyle = color + '30'
          ctx.beginPath()
          ctx.arc(x, y, radius + 6, 0, Math.PI * 2)
          ctx.fill()
        }

        // Agent body
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Energy ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${entity.life.energy / 200})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, radius + 2, 0, Math.PI * 2)
        ctx.stroke()

        // Name label (only for selected or large energy)
        if (isSelected || entity.life.energy > 80) {
          ctx.fillStyle = 'rgba(200, 200, 220, 0.8)'
          ctx.font = '8px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(entity.name.slice(0, 4), x, y - radius - 4)
        }
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [selectedAgentId])

  const handleSpawn = () => {
    const name = spawnName.trim() || `Agent-${Math.floor(Math.random() * 999)}`
    realityRef.current?.spawnAgent(name)
    setSpawnName('')
    syncState()
  }

  const handleStep = () => {
    realityRef.current?.step()
    syncState()
  }

  const selectedAgent = agents.find(a => a.id === selectedAgentId)

  return (
    <div className="h-[calc(100dvh-7rem)] flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Canvas + Controls */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="shrink-0 px-4 py-2 border-b border-purple-900/20 flex flex-wrap items-center gap-2">
            <h1 className="text-sm font-bold text-white mr-2">Agentic Reality</h1>
            <Button
              onClick={() => setRunning(!running)}
              variant="ghost"
              className={`text-[10px] h-6 px-2 ${running ? 'text-red-400' : 'text-green-400'}`}
            >
              {running ? '⏹ PAUSE' : '▶ RUN'}
            </Button>
            <Button onClick={handleStep} variant="ghost" className="text-[10px] h-6 px-2 text-amber-400">STEP</Button>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500">SPD</span>
              <input
                type="range" min={10} max={500} value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-16 h-1"
              />
              <span className="text-[9px] text-gray-500">{speed}ms</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Input
                placeholder="Name..." value={spawnName} onChange={(e) => setSpawnName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSpawn()}
                className="bg-[#0a0a1a] border-purple-900/30 text-[10px] h-6 w-24"
              />
              <Button onClick={handleSpawn} className="bg-purple-900/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 text-[10px] h-6 px-2">SPAWN</Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative min-h-0 p-2">
            <canvas ref={canvasRef} className="w-full h-full rounded-lg bg-[#050510]" />
            {/* Overlay stats */}
            {stats && (
              <div className="absolute top-3 left-3 flex flex-col gap-1 text-[9px] font-mono">
                <span className="text-green-400">{stats.alive} alive</span>
                <span className="text-red-400">{stats.dead} dead</span>
                <span className="text-purple-400">{stats.totalChildren} children</span>
                <span className="text-gray-500">step {stats.totalAgents > 0 ? (agents.find(a => a.life.alive)?.life.age ?? 0) : 0}</span>
              </div>
            )}
          </div>

          {/* Reality Stats Bar */}
          {stats && (
            <div className="shrink-0 px-4 py-2 border-t border-purple-900/20 grid grid-cols-6 gap-2 text-[10px]">
              <div className="text-center">
                <div className="text-green-400 font-bold">{stats.sattvaPercent.toFixed(0)}%</div>
                <div className="text-gray-600">Sattva</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold">{stats.rajasPercent.toFixed(0)}%</div>
                <div className="text-gray-600">Rajas</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{stats.tamasPercent.toFixed(0)}%</div>
                <div className="text-gray-600">Tamas</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{stats.buildings}</div>
                <div className="text-gray-600">Buildings</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-400 font-bold">{stats.terrafoms}</div>
                <div className="text-gray-600">Terraforms</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold">{stats.avgEnergy.toFixed(0)}</div>
                <div className="text-gray-600">Avg Energy</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Agent List + Detail + Events */}
        <div className="w-full lg:w-80 border-l border-purple-900/20 flex flex-col min-h-0">
          {/* Agent List */}
          <div className="shrink-0 p-2 border-b border-purple-900/20">
            <div className="text-[10px] text-gray-500 font-bold mb-1">LIVING AGENTS</div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {agents.filter(a => a.life.alive).map(agent => {
                const color = agent.circuitFamily ? CIRCUIT_GROUP_COLORS[agent.circuitFamily as CircuitGroup] : '#9ca3af'
                const isSelected = agent.id === selectedAgentId
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(isSelected ? null : agent.id)}
                    className={`flex-shrink-0 px-2 py-1 rounded text-[9px] border transition-all ${isSelected ? 'border-white/30 bg-white/[0.05]' : 'border-transparent bg-white/[0.02]'}`}
                    style={{ color }}
                    title={`${agent.name} | E:${agent.life.energy.toFixed(0)} | A:${agent.life.age}`}
                  >
                    {agent.name.slice(0, 6)}
                  </button>
                )
              })}
              {agents.filter(a => a.life.alive).length === 0 && (
                <span className="text-[9px] text-gray-600">No living agents</span>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {/* Selected Agent Detail */}
              {selectedAgent ? (
                <Card className="bg-[#0a0a1a] border-purple-900/20">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs text-white">{selectedAgent.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded border"
                          style={{
                            color: selectedAgent.circuitFamily ? CIRCUIT_GROUP_COLORS[selectedAgent.circuitFamily as CircuitGroup] : '#9ca3af',
                            borderColor: (selectedAgent.circuitFamily ? CIRCUIT_GROUP_COLORS[selectedAgent.circuitFamily as CircuitGroup] : '#9ca3af') + '40',
                            backgroundColor: (selectedAgent.circuitFamily ? CIRCUIT_GROUP_COLORS[selectedAgent.circuitFamily as CircuitGroup] : '#9ca3af') + '15',
                          }}
                        >
                          {selectedAgent.circuitFamily ? CIRCUIT_GROUP_LABELS[selectedAgent.circuitFamily as CircuitGroup] || selectedAgent.circuitFamily : 'none'}
                        </span>
                        <span className="text-[8px] text-gray-600">gen {selectedAgent.life.generation}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 space-y-2">
                    {/* Energy */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-gray-500">Energy</span>
                        <span className={selectedAgent.life.energy > 50 ? 'text-green-400' : selectedAgent.life.energy > 20 ? 'text-amber-400' : 'text-red-400'}>
                          {selectedAgent.life.energy.toFixed(0)}/{selectedAgent.life.maxEnergy.toFixed(0)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#111] rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${(selectedAgent.life.energy / selectedAgent.life.maxEnergy) * 100}%`,
                            backgroundColor: selectedAgent.life.energy > 50 ? '#4ade80' : selectedAgent.life.energy > 20 ? '#fbbf24' : '#f87171'
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div><span className="text-gray-500">Age:</span> <span className="text-gray-300">{selectedAgent.life.age}</span></div>
                      <div><span className="text-gray-500">Pos:</span> <span className="text-gray-300">{selectedAgent.life.position}</span></div>
                      <div><span className="text-gray-500">Coherence:</span> <span className="text-blue-400">{(selectedAgent.life.environmentalCoherence * 100).toFixed(0)}%</span></div>
                      <div><span className="text-gray-500">XP:</span> <span className="text-cyan-400">{selectedAgent.life.totalExperience.toFixed(1)}</span></div>
                      <div><span className="text-gray-500">Mutation:</span> <span className="text-purple-400">{(selectedAgent.life.mutationRate * 100).toFixed(0)}%</span></div>
                      <div><span className="text-gray-500">Children:</span> <span className="text-green-400">{selectedAgent.life.children.length}</span></div>
                      <div><span className="text-gray-500">Perception:</span> <span className="text-gray-300">{selectedAgent.life.perceptionRadius}</span></div>
                      <div><span className="text-gray-500">Gates:</span> <span className="text-gray-300">{selectedAgent.primaryGates.length}</span></div>
                    </div>

                    {/* Last Action */}
                    {selectedAgent.life.lastAction && (
                      <div className="text-[9px] p-1.5 rounded bg-white/[0.02]">
                        <span className="text-gray-500">Last action:</span>{' '}
                        <span className="text-amber-400">{selectedAgent.life.lastAction.type}</span>
                      </div>
                    )}

                    {/* Experience log */}
                    {selectedAgent.life.experience.length > 0 && (
                      <div className="space-y-0.5 max-h-24 overflow-auto">
                        <div className="text-[8px] text-gray-600 font-bold">RECENT EXPERIENCE</div>
                        {selectedAgent.life.experience.slice(-5).map((exp, i) => (
                          <div key={i} className="flex items-center justify-between text-[8px] px-1 py-0.5 rounded bg-white/[0.01]">
                            <span className="text-gray-500">{exp.action}</span>
                            <span className={exp.reward > 0 ? 'text-green-400' : exp.reward < 0 ? 'text-red-400' : 'text-gray-500'}>
                              {exp.reward > 0 ? '+' : ''}{exp.reward.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-[10px] text-gray-600 text-center py-4">Click an agent on the field or from the list</div>
              )}

              {/* Circuit Distribution */}
              {stats && (
                <Card className="bg-[#0a0a1a] border-purple-900/20">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-[10px] text-gray-400">Circuit Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 space-y-1">
                    {Object.entries(stats.byCircuit).map(([circuit, count]) => {
                      const color = CIRCUIT_GROUP_COLORS[circuit as CircuitGroup] || '#9ca3af'
                      const total = stats.alive || 1
                      return (
                        <div key={circuit} className="flex items-center justify-between text-[9px]">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-gray-500">{CIRCUIT_GROUP_LABELS[circuit as CircuitGroup] || circuit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{count}</span>
                            <div className="w-12 h-1 bg-[#111] rounded overflow-hidden">
                              <div className="h-full rounded" style={{ width: `${(count / total) * 100}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Events Log */}
              <Card className="bg-[#0a0a1a] border-purple-900/20">
                <CardHeader className="pb-1 pt-3 px-3">
                  <CardTitle className="text-[10px] text-gray-400">Reality Events</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="space-y-0.5 max-h-48 overflow-auto">
                    {events.length === 0 && <p className="text-[9px] text-gray-600 text-center">No events yet</p>}
                    {[...events].reverse().slice(0, 30).map((evt, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[8px]">
                        <span className={`font-bold ${EVENT_COLORS[evt.type] || 'text-gray-500'} uppercase w-14 shrink-0`}>{evt.type}</span>
                        <span className="text-gray-500 shrink-0">s{evt.step}</span>
                        <span className="text-gray-400">{evt.details}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* How it works */}
              <div className="text-[9px] text-gray-600 space-y-1 p-2 rounded bg-white/[0.01]">
                <div className="text-gray-500 font-bold">HOW IT WORKS</div>
                <p>Agents <span className="text-gray-400">perceive</span> the 81-field around them.</p>
                <p>They <span className="text-gray-400">decide</span> based on their circuit family.</p>
                <p>They <span className="text-gray-400">act</span> — move, flip gates, signal, communicate, reproduce.</p>
                <p>They <span className="text-gray-400">grow</span> through experience and pass gates to children.</p>
                <p>They <span className="text-red-400">die</span> — starvation, old age, or chaos.</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
