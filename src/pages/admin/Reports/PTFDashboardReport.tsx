/**
 * PTF Module - Dashboard
 * EXACT replica of admin/ptf/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { generateMockPTFIssues, PTFIssue } from '../../../lib/mocks/data/ptfIssuesData';
import { FileText, Clock, CheckCircle, XCircle, Square } from 'lucide-react';

export default function PTFDashboardReport() {
  const [ptfIssues] = useState<PTFIssue[]>(() => generateMockPTFIssues());

  // Calculate PTF Issues totals (matching image - 8 cards)
  const issueTotals = useMemo(() => {
    const totalIssues = ptfIssues.length;
    const pendingApproval = ptfIssues.filter(i => i.status === 0).length;
    const openApproved = ptfIssues.filter(i => i.status === 1).length;
    const notApproved = ptfIssues.filter(i => i.status === 2).length;
    const completed = ptfIssues.filter(i => i.status === 3).length;
    const decisionsPending = ptfIssues.filter(i => i.decision === null).length;
    
    const today = new Date().toISOString().split('T')[0];
    const onTarget = ptfIssues.filter(i => 
      i.status === 1 && 
      i.timeline !== null && 
      i.timeline > today
    ).length;
    
    const criticallyDelayed = ptfIssues.filter(i => 
      i.status === 1 && 
      i.timeline !== null && 
      i.timeline < today
    ).length;

    return {
      totalIssues,
      pendingApproval,
      openApproved,
      notApproved,
      completed,
      decisionsPending,
      onTarget,
      criticallyDelayed
    };
  }, [ptfIssues]);

  // Status cards data (matching image - 8 cards in 3x3 grid with one empty)
  // Order: Row 1: Total Issues, Pending Approval, Open/Approved
  //        Row 2: Not Approved, Decisions Pending, [EMPTY]
  //        Row 3: On Target, Critically Delayed, Completed
  const statusCards = useMemo(() => [
    {
      route: '/admin/ptf/list-issue-all',
      title: 'Total Issues',
      count: issueTotals.totalIssues,
      icon: FileText,
      iconColor: '#FFC107' // Yellow clipboard
    },
    {
      route: '/admin/ptf/list-issue-all?status=0',
      title: 'Pending Approval',
      count: issueTotals.pendingApproval,
      icon: Clock,
      iconColor: '#000' // Black hourglass
    },
    {
      route: '/admin/ptf/list-issue-all?status=1',
      title: 'Open/Approved',
      count: issueTotals.openApproved,
      icon: CheckCircle,
      iconColor: '#1DC39F' // Multicolored gear
    },
    {
      route: '/admin/ptf/list-issue-all?status=2',
      title: 'Not Approved',
      count: issueTotals.notApproved,
      icon: XCircle,
      iconColor: '#E74039' // Red document with X
    },
    {
      route: '/admin/ptf/list-issue-all?status=no-decision',
      title: 'Decisions Pending',
      count: issueTotals.decisionsPending,
      icon: FileText,
      iconColor: '#000' // Black document with clock
    },
    null, // Empty card in position 6
    {
      route: '/admin/ptf/list-issue-all?status=1&type=on',
      title: 'On Target',
      count: issueTotals.onTarget,
      icon: Square,
      iconColor: '#17c653' // Green striped square
    },
    {
      route: '/admin/ptf/list-issue-all?status=1&type=off',
      title: 'Critically Delayed',
      count: issueTotals.criticallyDelayed,
      icon: Square,
      iconColor: '#E74039' // Red square
    },
    {
      route: '/admin/ptf/list-issue-all?status=3',
      title: 'Completed',
      count: issueTotals.completed,
      icon: Square,
      iconColor: '#0E8160' // Green square
    }
  ], [issueTotals]);


  return (
    <div className="content-wrapper">
      <style>{`
        .moduleCard {
          padding: 20px;
          width: 100%;
          min-height: 180px;
          background-color: #fff;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: 1px solid rgba(224, 230, 246, 1);
          transition: all 0.2s linear;
          margin-bottom: 20px;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }
        .moduleCard:hover {
          transform: scale(1.02);
        }
        .moduleCard h4 {
          font-size: 1rem;
          color: #000;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 0;
          font-weight: bold;
        }
        .moduleCard .imgdiv {
          width: 100%;
          height: 80px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 10px;
        }
        .moduleCard .imgdiv img,
        .moduleCard .imgdiv svg {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        .moduleCard .imgdiv span {
          color: #3282FF;
          font-size: 14px;
          font-weight: bold;
          margin-top: 5px;
        }
        .content-wrapper {
          background: linear-gradient(270deg, #f4fff3 0%, #fbfefc 100%) !important;
        }
      `}</style>
      <div className="content-wrapper">
        <div className="row">
          {statusCards.map((card, index) => {
            if (card === null) {
              // Empty card
              return (
                <div key={index} className="col-md-4">
                  <div className="moduleCard" style={{ opacity: 0.3 }}>
                    {/* Empty card */}
                  </div>
                </div>
              );
            }
            
            const IconComponent = card.icon;
            const isGreenSquare = card.title === 'On Target' || card.title === 'Completed';
            const isRedSquare = card.title === 'Critically Delayed';
            const isOnTarget = card.title === 'On Target';
            
            return (
              <div key={index} className="col-md-4">
                <Link to={card.route} style={{ textDecoration: 'none' }}>
                  <div className="moduleCard">
                    <div className="imgdiv" style={{ color: card.iconColor }}>
                      {isGreenSquare || isRedSquare ? (
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: isOnTarget ? 'transparent' : card.iconColor,
                            backgroundImage: isOnTarget 
                              ? `repeating-linear-gradient(
                                  45deg,
                                  ${card.iconColor},
                                  ${card.iconColor} 8px,
                                  #a8e6a8 8px,
                                  #a8e6a8 16px
                                )`
                              : 'none',
                            border: isOnTarget ? `2px solid ${card.iconColor}` : 'none'
                          }}
                        />
                      ) : (
                        <IconComponent size={60} color={card.iconColor} />
                      )}
                      <span>{card.title}</span>
                    </div>
                    <h4>{card.count}</h4>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
