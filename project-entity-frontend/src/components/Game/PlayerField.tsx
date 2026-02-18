import React from 'react';
import Zone from './Zone';

interface PlayerFieldProps {
    player: 'p1' | 'p2';
    isMirrored: boolean;
}

const PlayerField: React.FC<PlayerFieldProps> = ({ player, isMirrored }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Center vertically
            alignItems: 'center',
            gap: '20px', // Space between rows
            padding: '20px'
        }}>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                {/* FIELD ZONES CONTAINER */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* ROW 1: PAWN ZONES */}
                    {/* If it's the opponent (top), the pawn zones should be closest to the center line? 
                         Wait, usually in TCGs:
                         Opponent Side:
                         [S/T] [S/T] [S/T] [S/T] [S/T] (Back Row)
                         [MON] [MON] [MON] [MON] [MON] (Front Row)
                         ---------------- CENTER LINE ----------------
                         [MON] [MON] [MON] [MON] [MON] (Front Row)
                         [S/T] [S/T] [S/T] [S/T] [S/T] (Back Row)

                         Since we rotate the opponent's field 180deg in GameField, we can just build it "normally" (Back Row top, Front Row bottom)
                         and the rotation handles the visual perspective.
                      */}

                    {/* PAWN ZONES (Front Row) */}
                    <div className="zone-row" style={{ display: 'flex', gap: '15px' }}>
                        {[...Array(5)].map((_, i) => (
                            <Zone key={`pawn-${i}`} type="Pawn" />
                        ))}
                    </div>

                    {/* UTILITY ZONES (Back Row - Actions/Conditions) */}
                    <div className="zone-row" style={{ display: 'flex', gap: '15px' }}>
                        {[...Array(5)].map((_, i) => (
                            <Zone key={`action-${i}`} type="Action" />
                        ))}
                    </div>
                </div>

                {/* SIDE ZONES (Deck/Grave/Void) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between', height: '100%' }}>
                    {/* Row: Grave & Void (TOP) */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Zone type="Grave" label="DISCARD" count={0} />
                        <Zone type="Void" label="VOID" count={0} />
                    </div>

                    {/* Row: Deck (BOTTOM) */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Zone type="Deck" label="DECK" count={35} />
                    </div>
                </div>
            </div>

        </div>
    );

};

export default PlayerField;
