import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  updatePassword as fbUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./index";
import UserService from "./user";

interface SignUpDto {
  email: string;
  password: string;
  username: string;
}

interface SignInDto {
  email: string;
  password: string;
}

const googleProvider = new GoogleAuthProvider();

const signUpWithEmail = async ({ email, password, username }: SignUpDto) => {
  if (!email || !password || !username) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await UserService.createUser({
      id: userCredential.user.uid,
      username,
      email,
      avatar: "",
    });

    await Promise.all([
      sendEmailVerification(userCredential.user),
      updateProfile(userCredential.user, {
        displayName: username,
      }),
    ]);

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signInWithEmail = async ({ email, password }: SignInDto) => {
  try {
    if (!email || !password) throw new Error("Missing email or password");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const additionalUserInfo = getAdditionalUserInfo(userCredential);
    if (additionalUserInfo?.isNewUser) {
      if (!userCredential.user.displayName || !userCredential.user.email)
        throw new Error("Missing username or email");
      await UserService.createUser({
        id: userCredential.user.uid,
        username: userCredential.user.displayName,
        email: userCredential.user.email,
        avatar: userCredential.user.photoURL ?? "",
      });
    }

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log(error);

    return { success: false, error };
  }
};

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

const updatePassword = async (currentPassword: string, newPassword: string) => {
  if (!currentPassword || !newPassword)
    throw new Error("Missing current or new password");
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user found");

  const isPasswordUser = user.providerData.some(
    (provider) => provider.providerId === "password",
  );
  if (!isPasswordUser) throw new Error("User is not password user");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  await fbUpdatePassword(user, newPassword);
  return;
};

const AuthService = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
  updatePassword,
};

export default AuthService;
