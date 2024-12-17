import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { WorkflowsPage } from '../pages/WorkflowsPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WorkflowFormPage } from '../pages/WorkflowFormPage';
import { WorkflowEditorPage } from '../pages/WorkflowEditorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'workflows',
        children: [
          {
            index: true,
            element: <WorkflowsPage />,
          },
          {
            path: ':id/edit',
            element: <WorkflowEditorPage />,
          },
        ],
      },
      {
        path: 'applications',
        element: <ApplicationsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/form/:id',
    element: <WorkflowFormPage />,
  },
]);