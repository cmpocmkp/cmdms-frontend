/**
 * PTF Module - Meetings Dashboard
 * EXACT replica of admin/ptf/meetings_dashboard.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Calendar, Clock } from 'lucide-react';

interface MeetingCard {
  title: string;
  count: number;
  route: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

export default function PTFMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [totalMeetings, setTotalMeetings] = useState<number>(0);
  const [todayMeetings, setTodayMeetings] = useState<number>(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState<number>(0);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock data for now
    setTotalMeetings(45);
    setTodayMeetings(3);
    setUpcomingMeetings(12);
    setLoading(false);
  }, []);

  const meetingCards: MeetingCard[] = [
    {
      title: 'Total Meetings',
      count: totalMeetings,
      route: '/admin/ptf/list-meetings',
      icon: List,
      iconColor: '#3282FF',
    },
    {
      title: "Today's Meetings",
      count: todayMeetings,
      route: '/admin/ptf/list-meetings?type=today',
      icon: Calendar,
      iconColor: '#0E8160',
    },
    {
      title: 'Upcoming Meetings',
      count: upcomingMeetings,
      route: '/admin/ptf/list-meetings?type=upcoming',
      icon: Clock,
      iconColor: '#F8C146',
    },
  ];

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

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
          cursor: pointer;
          text-decoration: none;
        }
        .moduleCard:hover {
          transform: scale(1.02);
          box-shadow: rgba(149, 157, 165, 0.3) 0px 12px 28px;
        }
        .moduleCard h4 {
          font-size: 2rem;
          color: #000;
          text-align: center;
          margin-top: 15px;
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
        .moduleCard .imgdiv svg {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        .moduleCard .imgdiv span {
          color: #3282FF;
          font-size: 14px;
          font-weight: bold;
          margin-top: 8px;
        }
        .content-wrapper {
          background: linear-gradient(270deg, #f4fff3 0%, #fbfefc 100%) !important;
          min-height: calc(100vh - 100px);
          padding: 20px;
        }
        a.moduleCard-link {
          text-decoration: none;
          color: inherit;
        }
        a.moduleCard-link:hover {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
      <div className="row">
        {meetingCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="col-md-4">
              <Link to={card.route} className="moduleCard-link">
                <div className="moduleCard">
                  <div className="imgdiv" style={{ color: card.iconColor }}>
                    <IconComponent size={60} color={card.iconColor} />
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
  );
}
