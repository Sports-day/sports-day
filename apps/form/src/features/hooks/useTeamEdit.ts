import { useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ADD_TEAM_MEMBER,
  CREATE_SPORT_ENTRY,
  CREATE_TEAM,
  DELETE_MEMBER,
  DELETE_TEAM,
  GET_SPORTSCENE,
  GET_SPORTSCENE_ENTRIES,
  GET_TEAM,
  GET_USERS,
} from "@/features/teamEdit.gql";

export type StudentInformation = {
  studentId: string;
  studentName: string;
};

type UserNode = {
  id: string;
  name: string;
};

type TeamNode = {
  id: string;
  users: UserNode[];
};

type SportSceneNode = {
  id: string;
  sport: { id: string };
  scene: { id: string };
  entries: { team: TeamNode }[];
};

type SportSceneEntriesData = {
  scenes: { sportScenes: { id: string; entries: { team: TeamNode }[] }[] }[];
};

type GetUsersData = {
  users: UserNode[];
};

type GetSportSceneData = {
  scenes: { sportScenes: SportSceneNode[] }[];
};

type GetTeamData = {
  team: { users: UserNode[] } | null;
};

type GetTeamVars = {
  teamId: string;
};

export function useTeamEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apolloClient = useApolloClient();

  const [localSelectedMember, setLocalSelectedMember] = useState<StudentInformation[] | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());
  const [searchName, setSearchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const teamId = searchParams?.get("teamid")?.trim() ?? "";
  const hasTeamId = teamId.length > 0;

  const { data: userData, loading: usersLoading } = useQuery<GetUsersData>(GET_USERS);
  const { data: sportSceneData, loading: sportSceneLoading } =
    useQuery<GetSportSceneData>(GET_SPORTSCENE);
  const teamQueryOptions = hasTeamId
    ? { variables: { teamId } }
    : { skip: true };
  const { data: teamData, loading: teamLoading } = useQuery<GetTeamData, GetTeamVars>(
    GET_TEAM,
    teamQueryOptions,
  );

  const sportScene = useMemo(() => {
    return sportSceneData?.scenes
      ?.flatMap((s) => s.sportScenes)
      ?.find((d) => d.sport.id === sports && d.scene.id === type);
  }, [sportSceneData, sports, type]);

  const sportSceneId = sportScene?.id ?? "";
  const { data: sportSceneEntriesData, loading: sportSceneEntriesLoading } = useQuery<
    SportSceneEntriesData
  >(GET_SPORTSCENE_ENTRIES);
  const loading =
    usersLoading ||
    sportSceneLoading ||
    sportSceneEntriesLoading ||
    (hasTeamId && teamLoading);

  const teamMembersFromQuery = useMemo(() => {
    return (
      teamData?.team?.users?.map((u) => ({
        studentId: u.id,
        studentName: u.name,
      })) ?? []
    );
  }, [teamData?.team?.users]);

  const selectedMember = useMemo(
    () => localSelectedMember ?? teamMembersFromQuery,
    [localSelectedMember, teamMembersFromQuery],
  );
  const selectedIds = useMemo(
    () => selectedMember.map((s) => s.studentId),
    [selectedMember],
  );
  const teamCount = useMemo(() => {
    const sc = sportSceneEntriesData?.scenes
      ?.flatMap((s) => s.sportScenes)
      ?.find((ss) => ss.id === sportSceneId);
    return sc?.entries?.length ?? 0;
  }, [sportSceneEntriesData, sportSceneId]);

  const filteredUsers = useMemo(() => {
    if (!userData?.users) return [];
    return userData.users.filter((u) => {
      if (searchName === "") return true;
      return u.name.includes(searchName);
    });
  }, [userData?.users, searchName]);

  const myTeamUserIds = useMemo(() => {
    return teamMembersFromQuery.map((u) => u.studentId);
  }, [teamMembersFromQuery]);

  const alreadyInAnyTeam = useMemo(() => {
    const myTeamUserIdSet = new Set(myTeamUserIds);
    const all = sportSceneData?.scenes
      ?.flatMap((s) => s.sportScenes)
      ?.filter((sportScene) => sportScene.scene.id === type)
      .flatMap((sportScene) =>
        sportScene.entries?.flatMap((entry) => entry.team?.users ?? []) ?? [],
      ) ?? [];
    return all.filter((user) => !myTeamUserIdSet.has(user.id));
  }, [myTeamUserIds, sportSceneData?.sportScenes, type]);

  const [addTeamMemberMutation] = useMutation(ADD_TEAM_MEMBER);
  const [createSportEntryMutation] = useMutation(CREATE_SPORT_ENTRY);
  const [createTeamMutation] = useMutation(CREATE_TEAM);
  const [deleteMemberMutation] = useMutation(DELETE_MEMBER);
  const [deleteTeamMutation] = useMutation(DELETE_TEAM);

  const addSelectedMember = (student: StudentInformation) => {
    setLocalSelectedMember((prev) => {
      const base = prev ?? teamMembersFromQuery;
      if (base.some((s) => s.studentId === student.studentId)) {
        return base;
      }
      return [...base, student];
    });
  };

  const createTeam = async () => {
    const { data } = await createTeamMutation({
      variables: {
        input: {
          name: `チーム${teamCount + 1}`,
        },
      },
    });
    return data?.createTeam?.id as string | undefined;
  };

  const addTeamMember = async (teamId: string, members: string[]) => {
    await addTeamMemberMutation({
      variables: {
        teamId,
        userIds: members,
      },
    });
  };

  const entryTeam = async (teamId: string, sportSceneIdValue: string) => {
    await createSportEntryMutation({
      variables: {
        sportSceneId: sportSceneIdValue,
        teamId,
      },
    });
  };

  const removeStudent = (studentId: string) => {
    if (hasTeamId) {
      setPendingDeleteIds((prev) => new Set([...prev, studentId]));
    }
    setLocalSelectedMember((prev) => {
      const base = prev ?? teamMembersFromQuery;
      return base.filter((s) => s.studentId !== studentId);
    });
  };

  const submit = async () => {
    if (isSubmitting) return;

    let createdTeamId: string | undefined;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (hasTeamId) {
        if (pendingDeleteIds.size > 0) {
          await deleteMemberMutation({
            variables: {
              teamId,
              userIds: [...pendingDeleteIds],
            },
          });
        }
        const myTeamUserIdSet = new Set(myTeamUserIds);
        const newMemberIds = selectedIds.filter((id) => !myTeamUserIdSet.has(id));
        if (newMemberIds.length > 0) {
          await addTeamMember(teamId, newMemberIds);
        }
      } else {
        if (!sportSceneId) return;
        const newTeamId = await createTeam();
        if (!newTeamId) return;
        createdTeamId = newTeamId;
        await addTeamMember(newTeamId, selectedIds);
        await entryTeam(newTeamId, sportSceneId);
      }
      await apolloClient.refetchQueries({
        include: [
          GET_SPORTSCENE,
          GET_SPORTSCENE_ENTRIES,
          GET_TEAM,
          "GetSceneSport",
          "GetAllTeamdata",
        ],
      });
      navigate(-1);
    } catch (error) {
      if (createdTeamId) {
        try {
          await deleteTeamMutation({
            variables: {
              deleteTeamId: createdTeamId,
            },
          });
        } catch {
          // Rollback failed; keep original error path.
        }
      }
      setSubmitError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    selectedMember,
    selectedIds,
    searchName,
    setSearchName,
    filteredUsers,
    alreadyInAnyTeam,
    addSelectedMember,
    removeStudent,
    submit,
    isSubmitting,
    submitError,
  };
}
