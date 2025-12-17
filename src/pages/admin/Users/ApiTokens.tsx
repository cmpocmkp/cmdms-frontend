/**
 * API Tokens Management Page - Admin Module
 * EXACT replica of admin/users/tokens/index.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAdminUsers, type AdminUser } from '../../../lib/mocks/data/adminUsers';

interface Token {
  id: number;
  name: string;
  created_at: string;
}

export default function ApiTokens() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenName, setTokenName] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const foundUser = mockAdminUsers.find(u => u.id === parseInt(id || '0'));
    if (foundUser) {
      setUser(foundUser);
      // Load mock tokens
      setTokens([
        { id: 1, name: 'Mobile App Token', created_at: '2024-01-15' },
        { id: 2, name: 'API Integration', created_at: '2024-02-20' },
      ]);
    } else {
      alert('User not found');
      navigate('/admin/users');
    }
  }, [id, navigate]);

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName.trim()) {
      alert('Please enter a token name');
      return;
    }

    // Generate a mock token
    const newToken = `cmdms_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedToken(newToken);
    setShowTokenModal(true);

    // Add to tokens list
    const newTokenObj: Token = {
      id: tokens.length + 1,
      name: tokenName,
      created_at: new Date().toISOString().split('T')[0],
    };
    setTokens(prev => [...prev, newTokenObj]);
    setTokenName('');

    // TODO: Implement actual API call when backend is ready
  };

  const handleRevokeToken = (tokenId: number) => {
    if (window.confirm('Are you sure you want to revoke this token?')) {
      setTokens(prev => prev.filter(t => t.id !== tokenId));
      console.log('Token revoked:', tokenId);
      // TODO: Implement API call when backend is ready
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  if (!user) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .modal {
          display: ${showTokenModal ? 'block' : 'none'};
          position: fixed;
          z-index: 1050;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
        }
        .modal-dialog {
          position: relative;
          width: auto;
          max-width: 500px;
          margin: 1.75rem auto;
          pointer-events: none;
        }
        .modal-dialog-centered {
          display: flex;
          align-items: center;
          min-height: calc(100% - 3.5rem);
        }
        .modal-content {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          pointer-events: auto;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 0.3rem;
          outline: 0;
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          border-top-left-radius: calc(0.3rem - 1px);
          border-top-right-radius: calc(0.3rem - 1px);
        }
        .modal-body {
          position: relative;
          flex: 1 1 auto;
          padding: 1rem;
          height: auto !important;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.75rem;
          border-top: 1px solid #dee2e6;
        }
        .modal-title {
          margin-bottom: 0;
          line-height: 1.5;
        }
        .close {
          padding: 0;
          background-color: transparent;
          border: 0;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          color: #000;
          opacity: .5;
          cursor: pointer;
        }
        .close:hover {
          opacity: .75;
        }
        .input-group {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          width: 100%;
        }
        .input-group-append {
          margin-left: -1px;
          display: flex;
        }
        .input-group-append .btn {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <div className="content-wrapper">
        <div className="card">
          <div className="card-header text-center">
            <div className="d-flex gap-3 justify-content-between align-items-center">
              <div className="flex-grow-1 text-center">
                <p className="block display-4">{user.name} - API Token Management</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="card">
              <div className="card-header">Generate new token</div>
              <div className="card-body">
                <form onSubmit={handleGenerateToken}>
                  <div className="form-group">
                    <label htmlFor="token_name">Token Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="token_name"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Generate Token
                  </button>
                </form>
              </div>
            </div>

            <hr />

            <h4>Existing Tokens</h4>
            <ul className="list-group">
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <li
                    key={token.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{token.name}</strong>
                      <br />
                      <small className="text-muted">Created: {token.created_at}</small>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRevokeToken(token.id)}
                    >
                      Revoke
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No tokens found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="modal fade show" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Your new API Token</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowTokenModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>
                    Copy this token now. You won't be able to see it again after
                    leaving the page:
                  </strong>
                </p>
                <div className="input-group">
                  <input
                    type="text"
                    id="apiToken"
                    className="form-control"
                    value={generatedToken}
                    readOnly
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={copyToken}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
                  Keep this token secure. It provides full access to your account.
                </div>
                {copySuccess && (
                  <div className="alert alert-success mt-2" role="alert">
                    Token copied to clipboard!
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setShowTokenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
